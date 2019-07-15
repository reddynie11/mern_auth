const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
mongoose.connect(process.env.DATABASE, {useNewUrlParser : true});

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieParser());

//models
const {User}=require('./models/user');

app.post('/user/register', (req,res)=>{
    const user = new User(req.body);
    user.save((err,data)=>{
        if (err){throw err}
        else{res.json({"Status": "saved", "Data" : data })}
    });
});

const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log('app started');
});