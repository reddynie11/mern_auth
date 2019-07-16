const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
mongoose.connect(process.env.DATABASE, {useNewUrlParser : true},(err)=>{
    if(err)throw err;
    console.log("Database connected");
});

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieParser());

//models
const {User}=require('./models/user');
const {auth}=require('./middleware/auth');

app.post('/user/register', (req,res)=>{
    const user = new User(req.body);
    user.save((err,data)=>{
        if (err){throw err}
        else{res.json({"Status": "saved", "Data" : data })}
    });
});

app.get('/user/auth',auth, (req,res)=>{
    res.json({user:req.user})
});

app.post('/user/login',(req,res)=>{
    //algo steps
    //1. check username/email in DB
    //2. compare password
    //3. create token in DB & send a cookie as responce
    User.findOne({'email': req.body.email}, (err,user)=>{
        if(!user){ return res.json({'Status':'email not registered'});}
        
            user.comparePassword(req.body.password, (err,isMatch)=>{
                if(!isMatch){ return res.json({'Status':'password not match'});}
        
                    user.generateToken((err,user)=>{
                        if(err) return res.status(400).send(err)
                        res.cookie('login_cookie',user.token).status(200).json({"Login Success":"True"});
                    })
            })
    })

})

const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log('app started');
});