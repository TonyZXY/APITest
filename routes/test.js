const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const options = {
    user: 'bglappdev100',
    pass: "appdevgkV6="
};

mongoose.connect('mongodb://localhost/BGLNewsAppbkend', options);


module.exports = router;

const News = require('../module/News.js');
const Video = require('../module/Video.js');
const NewsFlash = require('../module/NewsFlash.js');
const Genuine = require('../module/Genuine.js');
const User = require('../module/User.js');


function verifyToken(req,res,next) {
    if (!req.headers.authorization) {
        return res.status(401).json({login:false})
    }
    let token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
        return res.status(401).json({login:false})
    }
    let payload = jwt.verify(token, 'keyForJWT');
    if (!payload) {
        return res.status(401).json({login:false})
    }
    req.userID = payload.subject;
    next()
}


router.get("/users", function (req, res) {
    const geTag = req.query.genuineTag;
    const limit = req.query.limit;
    Genuine.findGenuineByTag(geTag, function (err, genuine) {
        if (err) {
            throw err;
        }
        res.json(genuine);
    }, parseInt(limit))
});

router.get("/members", (req, res) => {
    const patten = req.query.patten;
    const languageTag = req.query.languageTag;
    Genuine.searchGenuine(languageTag, patten, (err, genuine) => {
        if (err) {
            throw err;
        }
        res.json(genuine);
    });
});