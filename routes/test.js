const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const db = require('../functions/postgredb');

const config = require('../config');


mongoose.connect(config.database,config.options);


module.exports = router;

const News = require('../module/News.js');
const Video = require('../module/Video.js');
const NewsFlash = require('../module/NewsFlash.js');
const Genuine = require('../module/Genuine.js');
const NotificationB = require('../functions/notification');


function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json({
            login: false
        })
    } else {
        let userProfile = req.headers.authorization.split(' ')[1];
        let token = req.headers.authorization.split(' ')[2];
        if (userProfile === null || userProfile === undefined || token === null || token === undefined) {
            return res.status(401).json({
                login: false
            })
        } else {
            let payload = jwt.verify(token, userProfile);
            if (!payload) {
                return res.status(401).json({
                    login: false
                })
            } else {
                req.userID = payload.subject;
                if (payload.subject !== userProfile) {
                    return res.status(401).json({
                        login: false
                    })
                } else {
                    next()
                }
            }
        }
    }
}







