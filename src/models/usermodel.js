const mongoose=require('mongoose');


const userSchema=mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        reuired: true,
        type: String,
    },
    name: {
        required: true,
        type: String
    },
    profile: {

        type: String
    },
    isverified:{
        type: Boolean,
        default: false,
    }

}, {timeStamp: true});

module.exports=mongoose.model('user', userSchema);