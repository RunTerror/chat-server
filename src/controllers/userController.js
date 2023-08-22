const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usermodel = require('../models/usermodel.js');
const { hashing, generateRandomNumber } = require('../logic/func.js'); // Utilize utility functions

const SECRET_KEY = 'chat-api'; // Consider storing in environment variable

const signUp = async (req, res) => {
  const { number, password, name } = req.body;
  
  try {
    const existingUser = await usermodel.findOne({ phone: number });
    
    if (existingUser) {
      return res.status(400).json({ message: `User with ${number} already exists` });
    }
    
    const hashedPassword = await hashing(password);
    const newUser = await usermodel.create({ phone: number, password: hashedPassword, name });
    
    return res.status(200).json({
      message: "Navigating to verification screen"
    });
  } catch (error) {
    return res.status(400).json({ message: "Error signing up" });
  }
}

const sendVerification = async (req, res) => {
  try {
    const { number } = req.body;
    const existingUser = await usermodel.findOne({ phone: number });

    if (!existingUser || existingUser.isverified) {
      return res.status(400).json({ message: "User does not exist or is already verified" });
    }

    const verificationCode = generateRandomNumber(100000, 999999);
    // ... Send verification message using Twilio ...

    const token = jwt.sign({ verificationcode: verificationCode, userid: existingUser._id }, SECRET_KEY);
    return res.status(200).json({
      user: existingUser,
      message: "Verification message sent",
      token: token
    });
  } catch (error) {
    return res.status(400).json({ message: "Error sending verification message" });
  }
}

const verification = async (req, res) => {
  const { code } = req.body;
  let token = req.headers.authorization;
  token = token.split(" ")[1];

  try {
    const User = jwt.verify(token, SECRET_KEY);
    if (code != User.verificationcode) {
      return res.status(400).json({ message: "Wrong verification code" });
    }

    const user = await usermodel.findByIdAndUpdate(
      User.userid,
      { isverified: true },
      { new: true }
    );

    const newToken = jwt.sign({ user: user }, SECRET_KEY);
    return res.status(200).json({
      user: user,
      token: newToken
    });
  } catch (error) {
    return res.status(400).json({ message: "Error verifying user" });
  }
}

const signin = async (req, res) => {
  const { number, password } = req.body;

  try {
    const existingUser = await usermodel.findOne({ phone: number });

    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!existingUser.isverified) {
      return res.status(400).json({ message: "User not verified" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect credentials" });
    }

    const token = jwt.sign({ user: existingUser }, SECRET_KEY);
    return res.status(200).json({
      user: existingUser,
      token: token
    });
  } catch (error) {
    return res.status(400).json({ message: "Error signing in" });
  }
}

module.exports = { signUp, sendVerification, verification, signin, post };
