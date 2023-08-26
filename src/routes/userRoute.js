const express=require('express');
const { signUp,
     signin,  
    sendVerification, verification 
    } = require('../controllers/userController');
const userRouter=express.Router();


userRouter.post('/signup', signUp);
userRouter.post('/signin', signin);

module.exports=userRouter;