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
const test = require('./routes/test');
const userLogin = require('./routes/userLogin');
const deviceManage = require('./routes/deviceManage');
const tradingpair = require('./routes/tradingpairManage');
const coin = require('./routes/coin');

const CoinData = require('./dataServices/CoinGlobalAvg');
const NewsFromNewsAPI = require('./dataServices/NewsFromNewsAPI');

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

mongoose.connect('mongodb://localhost/APITest'/**, options**/);
// mongoose.connect('mongodb://localhost/news');
const db = mongoose.connection;

app.use('/api', api);
app.use('/userLogin', userLogin);
app.use('/login',login);
app.use('/test',test);
app.use('/deviceManage',deviceManage);
app.use('/tradingpairManage',tradingpair);
app.use('/coin',coin);


//nothing
app.get('/', function (req, res) {
    res.send('helloworld');
});

//start application
var port = 3030;
app.listen(port);
console.log(`Running on port ${port}`);
CoinData.run();
// NewsFromNewsAPI.run();




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

//const al = require('./functions/coinAlgorithm')
// var minutes = 1, the_interval = minutes * 60*1000;
// setInterval(function() {
//   console.log("I am doing my 5 seconds check");
//   al.getPriceFromAPI("BTC","USD","Kraken", function(response){
//       console.log(response);
//   })
// }, the_interval);





/* TESTING PART END */
