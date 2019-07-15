const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = mongoose.Schema({
    email : {
        type : String,
        required : true,
        trim : true,
        unique : 1
    },
    password : {
        type : String,
        required : true,
        minlenght : 5
    },
    name : {
        type : String,
        required: true,
        maxlength : 100
    },
    lastname : {
        type : String,
        required: true,
        maxlength : 100
    },
    cart : {
        type : Array,
        default : []
    },
    history : {
        type : Array,
        default : []
    },
    role : {
        type : Number,
        default : 0
    },
    token : {
        type : String
    }  
});

userSchema.pre('save',function(next){
    var user = this;

    bcrypt.genSalt(10,function(err,salt){
        if (err){
            return next(err)
        }
        bcrypt.hash(user.password,salt,function(err,hash){
            if (err){
                return next(err)
            }
            else{
                user.password = hash;
                next();
            }
        })
    })

    
})

const User = mongoose.model('User_m', userSchema);

module.exports = {User};