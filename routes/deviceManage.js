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

const IOSDevice = require('../module/IOSDevice');

router.post('/addIOSDevice', function (req, res) {
    const device = req.body;
    News.addNews(newsAdded, function (err, news) {
        if (err) {
            console.log(err);
        }
        res.json(news);
    })
});