const express=require('express');
const app=express();
const mongoose= require('mongoose');
const PORT = process.env.PORT || 1001;
require('dotenv').config();
const userRouter=require('./routes/userRoute');
const { signUp } = require('./controllers/userController');


app.use(express.json());

app.get('/',(req, res)=>{
    res.json("This is Chit Chat server");
})

app.use('/user',userRouter);


mongoose.connect('mongodb+srv://bansalabhishek7411:AbhiZ12@cluster0.edbgthb.mongodb.net/?retryWrites=true&w=majority').then((result) => {
    app.listen(PORT, (req, res)=>{
        console.log('server started at: '+ PORT);
    })
}).catch((err) => {
    console.log(err);
    
});


// express.api=functions.https.onRequest(app); 