const twilio = require('twilio');
const usermodel = require('../models/usermodel.js');
const accountSid = 'AC3319865f46c783a65612a7ea7cea4ac2';
const authToken = '8792587382ee9f0437f8ca08f3855bd0';
const twilioClient = twilio(accountSid, authToken);
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'chat-api';
const bcrypt = require('bcrypt');
const { hashing } = require('../logic/func.js');
// const multer = require('multer');
// const { error } = require('console');





const post = async (req, res) => {

    try {
        const userId = req.params.userId;
        const user = await usermodel.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        user.profile = req.file.filename;
        await user.save();

        return res.status(200).send('Profile picture uploaded successfully');
    } catch (error) {
        return res.status(500).send('Error uploading profile picture');
    }

}



const signUp = async (req, res) => {

    const { number, password, name } = req.body;
    try {
        const existingUser = await usermodel.findOne({ phone: number });
        if (existingUser) {
            return res.status(400).json(`User with ${number} already exist`);
        }
        const hashedpassword = await hashing(password);
        const newuser = await usermodel.create({ phone: number, password: hashedpassword, name: name });
        return res.status(200).json({
            message: "Navigating to verification screen"
        });
    } catch (error) {
        return res.status(400).json(error);
    }
}

const sendVerification = async (req, res) => {
    try {
        const { number } = req.body;
        const existinguser = await usermodel.findOne({ phone: number });
        if (existinguser && existinguser.isverified == true) {
            return res.status(400).json("User already exist and verfied!");
        }
        function generateRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        const verificationCode = generateRandomNumber(100000, 999999);
        await twilioClient.messages.create({
            body: `Your verification code is: ${verificationCode}`,
            from: '+17622488917',
            to: existinguser.phone
        }).then((message) => {
            const token = jwt.sign({ verificationcode: verificationCode, userid: existinguser._id }, SECRET_KEY);
            return res.status(200).json({
                user: existinguser,
                message: message.sid,
                token: token
            });
        }).catch((error) => {
            return res.json("unable to send to verification message please try after some time!");
        });
    } catch (error) {
        return res.status(400).json(error);
    }
}


const verification = async (req, res) => {
    const { code } = req.body;
    let token = req.headers.authorization;
    token = token.split(" ")[1];
    const User = jwt.verify(token, SECRET_KEY);
    try {
        if (code != User.verificationcode) {
            return res.status(400).json({
                message: "wrong code"
            })
        }
        console.log(User.userid);
        const user = await usermodel.findById(User.userid);
        const token = jwt.sign({ user: user }, SECRET_KEY);
        await usermodel.findOneAndUpdate({ _id: User.userid }, { isverified: true }, { new: true })
        .then((message)=>
            res.status(200).json({
                user: user,
                token: token
            })
        )
        .catch((error) => res.status(404).json(error));
    } catch (error) {
        return res.status(400).json(error);
    }
}

const signin = async (req, res) => {
    const { number, password } = req.body;

    try {
        const existinguser = await usermodel.findOne({ phone: number });
        if (!existinguser) {
            return res.status(400).json("Go to signup page");
        }
        if (!existinguser.isverified) {
            return res.status(400).json("User not verified");
        }
        let ans = await bcrypt.compare(password, existinguser.password);
        if (!ans) {
            return res.status(400).json("wrong credentails");
        }
        const token = jwt.sign({ user: existinguser }, SECRET_KEY);
        return res.status(200).json({
            user: existinguser,
            token: token
        });

    } catch (error) {
        return req.json(404).json(error);

    }

}

module.exports = { signUp, sendVerification, verification, signin, post };