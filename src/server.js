const express=require('express');
const mongoose=require('mongoose');
const userRouter = require('./routes/userRoute');


const app =express();

app.use(express.json());

const PORT=process.env.PORT || 1001;

app.use('/user', userRouter);
app.use('/', (req,res)=>{
    try {
        res.json("This server is created by Abhishek Bansal");
        
    } catch (error) {
        return res.send(error);
    }
})

mongoose.connect('mongodb+srv://bansalabhishek7411:AbhiZ12@cluster0.edbgthb.mongodb.net/?retryWrites=true&w=majority').then(()=>{
    app.listen(PORT, (req,res)=>{
        console.log("server started at port: "+PORT);

    });
}).catch((error)=>{
    console.log(error);
});

