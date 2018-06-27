const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const options = {
    user: 'bglappdev100',
    pass: "appdevgkV6="
};

mongoose.connect('mongodb://localhost/APITest');


module.exports = router;

const News = require('../module/News.js');
const Video = require('../module/Video.js');
const NewsFlash = require('../module/NewsFlash.js');
const Genuine = require('../module/Genuine.js');
const User = require('../module/User.js');
const Interest = require('../module/CoinInterest');


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



router.get("/users", verifyToken, function (req, res) {
    const geTag = req.query.genuineTag;
    const limit = req.query.limit;
    Genuine.findGenuineByTag(geTag, function (err, genuine) {
        if (err) {
            throw err;
        }
        res.json(genuine);
    }, parseInt(limit))
});

router.get("/members", verifyToken, (req, res) => {
    const patten = req.query.patten;
    const languageTag = req.query.languageTag;
    Genuine.searchGenuine(languageTag, patten, (err, genuine) => {
        if (err) {
            throw err;
        }
        res.json(genuine);
    });
});

router.get('/news', verifyToken, function (req, res) {
    News.getNewsList(function (err, newsList) {
        if (err) {
            console.log(err);
        }
        res.json(newsList);
    })
});

router.post('/news', (req, res) => {
    const newsAdded = req.body;
    News.findNews(newsAdded.title, newsAdded.publishedTime, (err, news) => {
        if (err) {
            console.log(err)
        }
        if (!news) {
            News.addNews(newsAdded, (err, news) => {
                if (err) {
                    console.log(err)
                }
                loginconsole('News Added: ' + news.title);
            })
        } else {
            loginconsole('In Database: ' + news.title);
        }
        res.status(200).send('OK');
    })
});

function loginconsole(message) {
    console.log(new Date(Date.now()).toLocaleString() + '   ' + message);
}





router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.passowrd;
    console.log(req.body);
    if (username === 'a' && (password !== null || password !== undefined)) {
        res.send({
            success: true,
            message: 'Login success',
            code: 200,
            token: 'Token is here'
        })
    } else {
        res.send({
            success: false,
            message: 'Login false',
            code: 403,
            token: null
        })
    }
});

router.post('/interest',(req,res)=>{
    const userID = req.body.userID;
    const coinFrom = req.body.coinFrom;
    const coinTo = req.body.coinTo;
    const price = req.body.price;
    const market = req.body.market;
    let interets = {
        coinFrom: coinFrom,
        coinTo: coinTo,
        market: market,
        price: price
    };
    Interest.AddInterest(userID,interets,(err,msg)=>{
        if (err){
            console.log(err);
        } else {
            res.json(msg);
        }
    })
});