const User = require('../module/User.js');
const express = require('express');
const router = express.Router();
const hashPassword = require('password-hash');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


const options = {
    user: 'bglappdev100',
    pass: "appdevgkV6="
};

mongoose.connect('mongodb://10.10.6.111:27017/BGLNewsAppbkend', options);

module.exports = router;


router.post("/set", (req,res)=> {
    const user = req.body;
    user.password = hashPassword.generate(user.password,{algorithm:'sha256',saltLength:10,iterations:10});
    User.setUpUsers(user,(err,user)=>{
        if (err) {
            console.log(err);
        }
        res.json(user)
    })
});

router.get("/get", (req,res) => {
    User.get((err,user)=>{
        res.json(user);
    })
});

router.post("/", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.getPassword(username, (err, user)=>{
        if (err) {
            console.log(err);
        } else {
            if (!user) {
                res.send({login:false}).status(401)
            } else {
                if ( !hashPassword.verify(password,user.password)) {
                    res.send({login:false}).status(401)
                } else {
                    let payload = { subject: user._id};
                    let tokenToSend = jwt.sign(payload, user._id.toString());
                    res.send({login:true,token:tokenToSend,username:user._id}).status(200)
                }
            }
        }

    })
});