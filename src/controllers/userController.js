const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const usermodel = require('../models/usermodel.js');
const secretkey = process.env.SECRET_KEY;





const SECRET_KEY = 'chat-api'; 

const signUp = async (req, res) => {
  const { number, name, password } = req.body;


  try {
    const existingUser = await usermodel.findOne({ phone: number });
    if (existingUser) {
      return res.status(400).json({ message: `User with ${number} already exists` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await usermodel.create({ phone: number, password: hashedPassword,name: name });
    
      
   var token=jwt.sign({userid: newUser._id, name: newUser.name}, SECRET_KEY);
   return res.status(200).json({
    token: token,
    number: newUser.phone,
    name: newUser.name,
    userid: newUser._id
   });

   
  } catch (error) {
    return res.status(400).json({ message: "Error signing up" });
  }
}

// const sendVerification = async (req, res) => {
//   try {
//     const { number } = req.body;
//     const existingUser = await usermodel.findOne({ phone: number });

//     if (!existingUser || existingUser.isverified) {
//       return res.status(400).json({ message: "User does not exist or is already verified" });
//     }

//     // ... Send verification message using Twilio ...
//     function generateRandomNumber(){
//       return Math.floor(Math.random()*900000 + 100000);
//      }

//      const code=generateRandomNumber();
//      const sender=process.env.SENDER_NUMBER;
//      await twilioclient.messages.create({
//         body: `Verification code for chit chat is ${code}`,
//         from: '+17622488917',
//         to: number
//       }).catch((error)=>{
//         console.log(error);
//         return res.json("Cannot send verfication please try after sometime!");
//       });

//     const token = jwt.sign({ verificationcode: code, userid: existingUser._id }, SECRET_KEY);
//     return res.status(200).json({
//       user: existingUser,
//       message: "Verification message sent",
//       token: token
//     });
//   } catch (error) {
//     return res.status(400).json({ message: "Error sending verification message" });
//   }
// }

// const verification = async (req, res) => {
//   const { code } = req.body;
//   let token = req.headers.authorization;
//   token = token.split(" ")[1];

//   try {
//     const User = jwt.verify(token, SECRET_KEY);
//     if (code != User.verificationcode) {
//       return res.status(400).json({ message: "Wrong verification code" });
//     }

//     const user = await usermodel.findByIdAndUpdate(
//       User.userid,
//       { isverified: true },
//       { new: true }
//     );

//     const newToken = jwt.sign({ user: user }, SECRET_KEY);
//     return res.status(200).json({
//       user: user,
//       token: newToken
//     });
//   } catch (error) {
//     return res.status(400).json({ message: "Error verifying user" });
//   }
// }

const signin = async (req, res) => {
  const { number, password } = req.body;

  try {
    const existingUser = await usermodel.findOne({ phone: number });

    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect credentials" });
    }

    const token = jwt.sign({ user: existingUser }, SECRET_KEY);
    return res.status(200).json({
    token: token,
    number: newUser.phone,
    name: newUser.name,
    userid: newUser._id
    });
  } catch (error) {
    return res.status(400).json({ message: "Error signing in" });
  }
}

module.exports = {
  signUp,
  signin,
};
