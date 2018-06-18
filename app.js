const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const hashPassword = require('password-hash');

app.use(cors());
app.use(bodyParser.json());

const api = require('./routes/api');
const login = require('./routes/login');

//import news and video module
const News = require('./module/News.js');
const Video = require('./module/Video.js');
const NewsFlash = require('./module/NewsFlash.js');
const Genuine = require('./module/Genuine.js');
const User = require('./module/User.js');


//connect to database
const options = {
    user: 'bglappdev100',
    pass: "appdevgkV6="
};

mongoose.connect('mongodb://localhost/BGLNewsAppbkend', options);
// mongoose.connect('mongodb://localhost/news');
const db = mongoose.connection;

app.use('/api', api);
app.use('/login',login);

//nothing
app.get('/', function (req, res) {
    res.send('helloworld');
});

//start application
app.listen(3000);
console.log('Running on port 3000');




/*----------------------------------------------------------------------------*/
/**
 * Please Write Testing Code here
 */
//test API
// app.get('/api/users',function (req,res) {
//     var name = req.query.name;
//     var user_id = req.query.id;
//
//     console.log(name +" "+user_id);
//
//     res.end();
// });

//test get last 2 records
// app.get('/api/users', function (req,res) {
//     News.getLastTwo(function(err,video){
//         if(err){
//             throw err;
//         }
//         res.json(video);
//     },3)
// });

//test get last 2 news records
// app.get('/api/users', function (req, res) {
//     var tag = "原创";
//     News.findNewsByTag(tag,function (err, news) {
//         if (err) {
//             throw err;
//         }
//         res.json(news);
//     },1)
// });

// app.get("/api/getnews",function (req,res) {
//     var loTag = req.query.localeTag;
//     var typeTag = req.query.contentTag;
//     var limit = req.query.limit;
//     News.findNewsByTag(loTag,typeTag,function (err,news) {
//         if(err){
//             throw err;
//         }
//         res.json(news);
//     },parseInt(limit))
// });

app.get("/api/users", function (req, res) {
    var geTag = req.query.genuineTag;
    var limit = req.query.limit;
    Genuine.findGenuineByTag(geTag, function (err, genuine) {
        if (err) {
            throw err;
        }
        res.json(genuine);
    }, parseInt(limit))
});

app.get("/api/members", (req, res) => {
    var patten = req.query.patten;
    var languageTag = req.query.languageTag;
    Genuine.searchGenuine(languageTag, patten, (err, genuine) => {
        if (err) {
            throw err;
        }
        res.json(genuine);
    });
});





/* TESTING PART END */
