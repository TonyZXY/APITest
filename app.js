var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var hashPassword = require('password-hash');

app.use(cors());
app.use(bodyParser.json());


//import news and video module
var News = require('./module/News.js');
var Video = require('./module/Video.js');
var NewsFlash = require('./module/NewsFlash.js');
var Genuine = require('./module/Genuine.js');
var User = require('./module/User.js');


//connect to database
var options = {
    user: 'bglappdev100',
    pass: "appdevgkV6="
};

mongoose.connect('mongodb://10.10.6.111:27017/BGLNewsAppbkend', options);
// mongoose.connect('mongodb://localhost/news');
var db = mongoose.connection;

//nothing
app.get('/', function (req, res) {
    res.send('helloworld');
});

//start application
app.listen(3000);
console.log('Running on port 3000');


/*----------------------------------------------------------------------------*/
/**
 * This part is for Update News in Database
 *
 * - get
 * - getByID
 * - add
 * - update
 * - delete
 * - get By category
 */
//get news list (all news)
app.get('/api/news', function (req, res) {
    News.getNewsList(function (err, newsList) {
        if (err) {
            throw err;
        }
        res.json(newsList);
    })
});

//get news by ID
app.get('/api/news/:_id', function (req, res) {
    News.getNewsByID(req.params._id, function (err, news) {
        if (err) {
            throw err;
        }
        res.json(news);
    })
});

//add news
app.post('/api/news', function (req, res) {
    var newsAdded = req.body;
    News.addNews(newsAdded, function (err, news) {
        if (err) {
            throw err;
        }
        res.json(news);
    })
});

//update news
app.put('/api/news/:_id', function (req, res) {
    var id = req.params._id;
    var news = req.body;
    News.updateNews(id, news, {}, function (err, news) {
        if (err) {
            throw err;
        }
        res.json(news);
    })
});

//delete news
app.delete('/api/news/:_id', function (req, res) {
    var id = req.params._id;
    News.deleteNews(id, function (err, news) {
        if (err) {
            throw err;
        }
        res.json(news);
    })
});

//get news by category
app.get("/api/getNews", function (req, res) {
    var loTag = req.query.localeTag;
    var typeTag = req.query.contentTag;
    var limit = req.query.limit;
    News.findNewsByTag(loTag, typeTag, function (err, news) {
        if (err) {
            throw err;
        }
        res.json(news);
    }, parseInt(limit))
});

app.get("/api/getNewsLocaleOnly", function (req, res) {
    var loTag = req.query.localeTag;
    var leTag = req.query.languageTag;
    var limit = req.query.limit;
    var skip = req.query.skip;
    News.findNewsByLocal(loTag, leTag, function (err, news) {
        if (err) {
            throw err;
        }
        res.json(news);
    }, parseInt(skip), parseInt(limit))
});

app.get("/api/getNewsContentOnly", function (req, res) {
    var typeTag = req.query.contentTag;
    var leTag = req.query.languageTag;
    var limit = req.query.limit;
    var skip = req.query.skip;
    News.findNewsByContent(typeTag, leTag, function (err, news) {
        if (err) {
            throw err;
        }
        res.json(news);
    }, parseInt(skip), parseInt(limit))
});


// search news objects
app.get("/api/searchnews", (req, res) => {
    var patten = req.query.patten;
    var languageTag = req.query.languageTag;
    var limit = req.query.limit;
    var skip = req.query.skip;
    News.searchNews(languageTag, patten, (err, news) => {
        if (err) {
            throw err;
        }
        res.json(news);
    }, parseInt(skip), parseInt(limit))
});

app.get("/api/searchNewsTime", (req,res) => {
    var from = req.query.from;
    var to = req.query.to;
    News.searchNewsTime(from,to,(err,news)=>{
        if (err) {
            throw err;
        }
        res.json(news);
    })
});
/*  NEWS PART END  */
/*----------------------------------------------------------------------------*/


/*----------------------------------------------------------------------------*/
/**
 * This part is for Update Video in Database
 *
 * - get
 * - getByID
 * - add
 * - update
 * - delete
 * - Get Video By category
 */
//get video List
app.get('/api/videos', function (req, res) {
    var leTag = req.query.languageTag;
    var skip = req.query.skip;
    var limit = req.query.limit;
    Video.getVideos(leTag, function (err, video) {
        if (err) {
            throw err;
        }
        res.json(video);
    }, parseInt(skip), parseInt(limit))
});

app.get('/api/video', (req, res) => {
    Video.getVideoList((err, video) => {
        if (err) {
            throw err;
        }
        res.json(video);
    })
});

//get video by id
app.get('/api/videos/:_id', function (req, res) {
    Video.getVideoByID(req.params._id, function (err, video) {
        if (err) {
            throw err;
        }
        res.json(video);
    })
});

// add video
app.post('/api/videos', function (req, res) {
    var videoAdded = req.body;
    Video.addVideo(videoAdded, function (err, video) {
        if (err) {
            throw err;
        }
        res.json(video);
    })
});

//update video
app.put('/api/videos/:_id', function (req, res) {
    var id = req.params._id;
    var videoAdded = req.body;
    Video.updateVideo(id, videoAdded, {}, function (err, video) {
        if (err) {
            throw err;
        }
        res.json(video);
    })
});

//delete video
app.delete('/api/videos/:_id', function (req, res) {
    var id = req.params._id;
    Video.deleteVideo(id, function (err, video) {
        if (err) {
            throw err;
        }
        res.json(video);
    })
});

//get video By category
app.get("/api/getVideo", function (req, res) {
    var loTag = req.query.localeTag;
    var tyTag = req.query.typeTag;
    var limit = req.query.limit;
    Video.findVideoByTag(loTag, tyTag, function (err, video) {
        if (err) {
            throw err;
        }
        res.json(video);
    }, parseInt(limit))
});

app.get("/api/getVideoLocaleOnly", function (req, res) {
    var loTag = req.query.localeTag;
    var limit = req.query.limit;
    Video.findVideoByLocale(loTag, function (err, video) {
        if (err) {
            throw err;
        }
        res.json(video);
    }, parseInt(limit))
});

app.get("/api/getVideoTypeOnly", function (req, res) {
    var tyTag = req.query.typeTag;
    var limit = req.query.limit;
    Video.findVideoByType(tyTag, function (err, video) {
        if (err) {
            throw err;
        }
        res.json(video);
    }, parseInt(limit))
});

app.get("/api/searchVideo", (req, res) => {
    var patten = req.query.patten;
    var languateTag = req.query.languageTag;
    var limit = req.query.limit;
    var skip = req.query.skip;
    Video.searchVideo(languateTag, patten, (err, video) => {
        if (err) {
            throw err;
        }
        res.json(video);
    }, parseInt(skip), parseInt(limit))
});

app.get('/api/searchVideoTime', (req,res) => {
    var from = req.query.from;
    var to = req.query.to;
    Video.searchVideoTime(from,to,(err,videos)=>{
        if(err){
            throw err;
        }
        res.json(videos)
    })
});
/* VIDEO PART END*/
/*----------------------------------------------------------------------------*/


/*----------------------------------------------------------------------------*/
/**
 * This part is for Update NewsFlash in Database
 *
 * - get
 * - getByID
 * - add
 * - update
 * - delete
 */
//get NewsFlash List
app.get('/api/flash', function (req, res) {
    var leTag = req.query.languageTag;
    NewsFlash.getFlashList(leTag, function (err, newsFlash) {
        if (err) {
            throw err;
        }
        res.json(newsFlash);
    })
});

//get newsFlash by ID
app.get('/api/flashList/:_id', function (req, res) {
    NewsFlash.getFlashByID(req.params._id, function (err, newsFlash) {
        if (err) {
            throw err;
        }
        res.json(newsFlash);
    })
});

app.get('/api/flashList', function (req, res) {
    NewsFlash.getFlash((err, newsFlash) => {
        if (err) {
            throw err;
        }
        res.json(newsFlash);
    })
});



//add News Flash
app.post('/api/flash', function (req, res) {
    var flashAdded = req.body;
    NewsFlash.addFlashNews(flashAdded, function (err, flashAdded) {
        if (err) {
            throw err;
        }
        res.json(flashAdded);
    })
});

//update News Flash
app.put('/api/flash/:_id', function (req, res) {
    var id = req.params._id;
    var flashAdded = req.body;
    NewsFlash.updateFlashNews(id, flashAdded, {}, function (err, flash) {
        if (err) {
            throw err;
        }
        res.json(flash);
    })
});

//delete News Flash
app.delete('/api/flash/:_id', function (req, res) {
    var id = req.params._id;
    NewsFlash.deleteFlash(id, function (err, newsFlash) {
        if (err) {
            throw err;
        }
        res.json(newsFlash);
    })
});

app.get("/api/searchFlash", (req, res) => {
    var patten = req.query.patten;
    var languateTag = req.query.languageTag;
    var limit = req.query.limit;
    var skip = req.query.skip;
    NewsFlash.searchFlashNews(languateTag, patten, (err, flash) => {
        if (err) {
            throw err;
        }
        res.json(flash);
    }, parseInt(skip), parseInt(limit))
});

app.get('/api/searchFlashTime', (req,res)=>{
    var from = req.query.from;
    var to = req.query.to;
    NewsFlash.searchFlashTime( from,to,(err,flash)=>{
        if(err){
            throw err;
        }
        res.json(flash);
    })
});

/* NEWSFLASH PART END */
/*----------------------------------------------------------------------------*/


/*----------------------------------------------------------------------------*/
/**
 * This part is for Update Genuine News in Database
 *
 * - get
 * - getByID
 * - add
 * - update
 * - delete
 * - get genuine news by category
 */
//get Genuine List
app.get('/api/genuine', function (req, res) {
    Genuine.getGenuineList(function (err, genuine) {
        if (err) {
            throw err;
        }
        res.json(genuine);
    })
});

//get Genuine By ID
app.get('/api/genuine/:_id', function (req, res) {
    Genuine.getGenuineByID(req.params._id, function (err, genuine) {
        if (err) {
            throw err;
        }
        res.json(genuine);
    })
});

// add genuine news
app.post('/api/genuine', function (req, res) {
    var genuineAdd = req.body;
    Genuine.addGenuine(genuineAdd, function (err, genuine) {
        if (err) {
            throw err;
        }
        res.json(genuine);
    })
});

//Update genuine
app.put('/api/genuine/:_id', function (req, res) {
    var id = req.params._id;
    var genuineAdd = req.body;
    Genuine.updateGenuine(id, genuineAdd, {}, function (err, genuine) {
        if (err) {
            throw err;
        }
        res.json(genuine);
    })
});

//delete genuine
app.delete('/api/genuine/:_id', function (req, res) {
    var id = req.params._id;
    Genuine.deleteGenuine(id, function (err, genuine) {
        if (err) {
            throw err;
        }
        res.json(genuine);
    })
});

//get genuine news by Category
app.get("/api/getgenuine", function (req, res) {
    var geTag = req.query.genuineTag;
    var leTag = req.query.languageTag;
    var limit = req.query.limit;
    var skip = req.query.skip;
    Genuine.findGenuineByTag(geTag, leTag, function (err, genuine) {
        if (err) {
            throw err;
        }
        res.json(genuine);
    }, parseInt(skip), parseInt(limit))
});

// search genuine objects
app.get("/api/searchgenuine", (req, res) => {
    var patten = req.query.patten;
    var languageTag = req.query.languageTag;
    var limit = req.query.limit;
    var skip = req.query.skip;
    Genuine.searchGenuine(languageTag, patten, (err, genuine) => {
        if (err) {
            throw err;
        }
        res.json(genuine);
    }, parseInt(skip), parseInt(limit))
});

app.get('/api/searchGenuineTime',(req,res)=>{
    var from = req.query.from;
    var to = req.query.to;
    Genuine.searchGenuineTime(from,to,(err,genuine)=>{
        if(err){
            throw err;
        }
        res.json(genuine);
    })
});

/* GENUINE PART ENDS */
/*----------------------------------------------------------------------------*/


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

app.post("/login/set", (req,res)=> {
    var user = req.body;
    user.password = hashPassword.generate(user.password,{algorithm:'sha256',saltLength:10,iterations:10});
    User.setUpUsers(user,(err,user)=>{
        if (err) {
            throw err;
        }
        res.json(user)
    })
});

app.get("/login/get", (req,res) => {
    User.get((err,user)=>{
        res.json(user);
    })
});

app.post("/login", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    User.getPassword(username, (err, user)=>{
        if (err) {
            throw err;
        }
        var userDatabase = user[0];
        if(hashPassword.verify(password,userDatabase.password)){
            res.json({login:true})
        }else {
            res.json({login:false})
        }
    })
});



/* TESTING PART END */
