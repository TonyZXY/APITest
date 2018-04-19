var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.json());


//import news and video module
var News = require('./module/News.js');
var Video = require('./module/Video.js');
var NewsFlash = require('./module/NewsFlash.js');
var Genuine = require('./module/Genuine.js');


//connect to database
mongoose.connect('mongodb://localhost/news');
var db = mongoose.connection;

//nothing
app.get('/', function (req, res) {
    res.send('helloworld');
});

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
app.get("/api/getnews",function (req,res) {
    var loTag = req.query.localeTag;
    var typeTag = req.query.contentTag;
    var limit = req.query.limit;
    News.findNewsByTag(loTag,typeTag,function (err,news) {
        if(err){
            throw err;
        }
        res.json(news);
    },parseInt(limit))
});

/*  NEWS PART END  */


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
    Video.getVideos(function (err, video) {
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
app.get("/api/getvideo",function (req,res) {
    var loTag = req.query.localeTag;
    var tyTag = req.query.typeTag;
    var limit = req.query.limit;
    Video.findVideoByTag(loTag,tyTag,function (err,video) {
        if(err){
            throw err;
        }
        res.json(video);
    },parseInt(limit))
});

/* VIDEO PART END*/

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
app.get('/api/flash', function (req,res) {
    NewsFlash.getFlashList(function (err,newsFlash) {
        if(err){
            throw err;
        }
        res.json(newsFlash);
    })
});

//get newsFlash by ID
app.get('/api/flash/:_id',function (req,res) {
    NewsFlash.getFlashByID(req.params._id,function (err,newsFlash) {
        if(err){
            throw err;
        }
        res.json(newsFlash);
    })
});

//add News Flash
app.post('/api/flash',function (req,res) {
    var flashAdded = req.body;
    NewsFlash.addFlashNews(flashAdded,function (err,flashAdded) {
        if(err){
            throw err;
        }
        res.json(flashAdded);
    })
});

//update News Flash
app.put('/api/flash/:_id',function (req,res) {
    var id = req.params._id;
    var flashAdded = req.body;
    NewsFlash.updateFlashNews(id,flashAdded,{},function (err,flash) {
        if(err){
            throw err;
        }
        res.json(flash);
    })
});

//delete News Flash
app.delete('/api/flash/:_id', function (req,res) {
    var id = req.params._id;
    NewsFlash.deleteFlash(id,function (err,newsFlash) {
        if(err){
            throw err;
        }
        res.json(newsFlash);
    })
});

/* NEWSFLASH PART END */


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
app.get('/api/genuine',function (req,res) {
    Genuine.getGenuineList(function(err,genuine){
        if(err){
            throw err;
        }
        res.json(genuine);
    })
});

//get Genuine By ID
app.get('/api/genuine/:_id',function (req,res) {
    Genuine.getGenuineByID(req.params._id,function (err,genuine) {
        if(err){
            throw err;
        }
        res.json(genuine);
    })
});

// add genuine news
app.post('/api/genuine',function(req,res){
    var genuineAdd = req.body;
    Genuine.addGenuine(genuineAdd,function (err,genuine) {
        if(err){
            throw err;
        }
        res.json(genuine);
    })
});

//Update genuine
app.post('/api/genuine/:_id',function (req,res){
    var id = req.params._id;
    var genuineAdd = req.body;
    Genuine.updateGenuine(id,genuineAdd,{},function (err, genuine) {
        if(err){
            throw err;
        }
        res.json(genuine);
    })
});

//delete genuine
app.delete('/api/genuine/:_id',function (req,res) {
    var id = req.params._id;
    Genuine.deleteGenuine(id,function (err,genuine) {
        if(err){
            throw err;
        }
        res.json(genuine);
    })
});

//get genuine news by Category
app.get("/api/getgenuine",function (req,res) {
    var geTag = req.query.genuineTag;
    var limit = req.query.limit;
    Genuine.findGenuineByTag(geTag,function (err,genuine) {
        if(err){
            throw err;
        }
        res.json(genuine);
    },parseInt(limit))
});

/* GENUINE PART ENDS */


//start application
app.listen(3000);
console.log('Running on port 3000');

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

app.get("/api/users",function (req,res) {
    var geTag = req.query.genuineTag;
    var limit = req.query.limit;
    Genuine.findGenuineByTag(geTag,function (err,genuine) {
        if(err){
            throw err;
        }
        res.json(genuine);
    },parseInt(limit))
});

/* TESTING PART END */
