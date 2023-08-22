const bcrypt=require('bcrypt');


function hashing(password){
    return  bcrypt.hash(password, 10);
}


module.exports={hashing};