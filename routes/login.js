const User = require('../module/User.js');
const express = require('express');
const router = express.Router();
const hashPassword = require('password-hash');
const mongoose = require('mongoose');
const options = {
    user: 'bglappdev100',
    pass: "appdevgkV6="
};

mongoose.connect('mongodb://localhost/BGLNewsAppbkend', options);

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
                res.status(401).json({login:false})
            } else {
                if ( !hashPassword.verify(password,user.password)) {
                    res.status(401).json({login:false})
                } else {
                    res.status(200).json({login:true})
                }
            }
        }

    })
});