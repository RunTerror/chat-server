const express=require('express');
const { signUp, sendVerification, verification, signin , post} = require('../controllers/userController');
const multer=require('multer');

const userRouter=express.Router();
const storage=multer.diskStorage({
    destination:function (req, file, cb){
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },

});

const upload=multer({storage: storage});

userRouter.post('/signup',signUp);
userRouter.post('/sendverification', sendVerification);
userRouter.post('/verification', verification);
userRouter.post('/signin', signin)
userRouter.post('/upload/:userId', upload.single('profilepicture'), post);



module.exports=userRouter;