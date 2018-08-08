const User = require('../module/User.js');
const express = require('express');
const router = express.Router();
const hashPassword = require('password-hash');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const logger = require('../functions/logger');


const config = require('../config');

mongoose.connect(config.database,config.options);

module.exports = router;


router.post("/set", (req, res) => {
    const user = req.body;
    let address = req.connection.remoteAddress;
    user.password = hashPassword.generate(user.password, {algorithm: 'sha256', saltLength: 10, iterations: 10});
    User.setUpUsers(user, (err, user) => {
        if (err) {
            console.log(err);
            logger.databaseError('login',address, err);
        }
        res.json(user);
        logger.adminLoginLog(address,"Set user in database in User Name: " + user.username);
    })
});

router.get("/get", (req, res) => {
    User.get((err, user) => {
        if(err){
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('login',address, err);
        }else{
           res.json(user);
           let address = req.connection.remoteAddress;
           logger.adminLoginLog(address,"Get all user in database in User Name: " + user.username);
        }
        
    })
});

router.post("/", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    let address = req.connection.remoteAddress;
    User.getPassword(username, (err, user) => {
        if (err) {
            console.log(err);
            logger.databaseError('login',address, err);
        } else {
            if (!user) {
                res.send({login: false}).status(401);
                logger.adminLoginLog(address,"No user found in User Name: " + username);
            } else {
                if (!hashPassword.verify(password, user.password)) {
                    res.send({login: false}).status(401);
                    logger.adminLoginLog(address,"Password Not match in User Name: " + username);
                } else {
                    let payload = {subject: user._id};
                    let tokenToSend = jwt.sign(payload, user._id.toString());
                    res.send({login: true, token: tokenToSend, username: user._id}).status(200);
                    logger.adminLoginLog(address,"Successfully Login in User Name: " + username);
                }
            }
        }

    })
});