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


function verifyToken(req,res,next) {
    if (!req.headers.authorization) {
        return res.status(401).json({login:false})
    }else {
        let userProfile = req.headers.authorization.split(' ')[1];
        let token = req.headers.authorization.split(' ')[2];
        if (userProfile === null || userProfile === undefined || token === null || token === undefined){
            return res.status(401).json({login:false})
        }else {
            let payload = jwt.verify(token, userProfile);
            if (!payload) {
                return res.status(401).json({login:false})
            }else {
                req.userID = payload.subject;
                if (payload.subject !== userProfile) {
                    return res.status(401).json({login:false})
                } else {
                    next()
                }
            }
        }
    }
}

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
router.get('/news', function (req, res) {
    News.getNewsList(function (err, newsList) {
        if (err) {
            console.log(err);
        }
        res.json(newsList);
    })
});

//get news by ID
router.get('/news/:_id', function (req, res) {
    News.getNewsByID(req.params._id, function (err, news) {
        if (err) {
            console.log(err);
        }
        res.json(news);
    })
});

//add news
router.post('/news',verifyToken , function (req, res) {
    const newsAdded = req.body;
    News.addNews(newsAdded, function (err, news) {
        if (err) {
            console.log(err);
        }
        res.json(news);
    })
});

//update news
router.put('/news/:_id',verifyToken , function (req, res) {
    const id = req.params._id;
    const news = req.body;
    News.updateNews(id, news, {}, function (err, news) {
        if (err) {
            console.log(err);
        }
        res.json(news);
    })
});

//delete news
router.delete('/news/:_id',verifyToken , function (req, res) {
    const id = req.params._id;
    News.deleteNews(id, function (err, news) {
        if (err) {
            console.log(err);
        }
        res.json(news);
    })
});

//get news by category
router.get("/getNews", function (req, res) {
    const loTag = req.query.localeTag;
    const typeTag = req.query.contentTag;
    const limit = req.query.limit;
    News.findNewsByTag(loTag, typeTag, function (err, news) {
        if (err) {
            console.log(err);
        }
        res.json(news);
    }, parseInt(limit))
});

router.get("/getNewsLocaleOnly", function (req, res) {
    const loTag = req.query.localeTag;
    const leTag = req.query.languageTag;
    const limit = req.query.limit;
    const skip = req.query.skip;
    News.findNewsByLocal(loTag, leTag, function (err, news) {
        if (err) {
            console.log(err);
        }
        res.json(news);
    }, parseInt(skip), parseInt(limit))
});

router.get("/getNewsContentOnly", function (req, res) {
    const typeTag = req.query.contentTag;
    const leTag = req.query.languageTag;
    const limit = req.query.limit;
    const skip = req.query.skip;
    News.findNewsByContent(typeTag, leTag, function (err, news) {
        if (err) {
            console.log(err);
        }
        res.json(news);
    }, parseInt(skip), parseInt(limit))
});


// search news objects
router.get("/searchnews", (req, res) => {
    const patten = req.query.patten;
    const languageTag = req.query.languageTag;
    const limit = req.query.limit;
    const skip = req.query.skip;
    News.searchNews(languageTag, patten, (err, news) => {
        if (err) {
            console.log(err);
        }
        res.json(news);
    }, parseInt(skip), parseInt(limit))
});

router.get("/searchNewsTime", (req,res) => {
    const from = req.query.from;
    const to = req.query.to;
    News.searchNewsTime(from,to,(err,news)=>{
        if (err) {
            console.log(err);
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
router.get('/videos', function (req, res) {
    const leTag = req.query.languageTag;
    const skip = req.query.skip;
    const limit = req.query.limit;
    Video.getVideos(leTag, function (err, video) {
        if (err) {
            console.log(err);
        }
        res.json(video);
    }, parseInt(skip), parseInt(limit))
});

router.get('/video', (req, res) => {
    Video.getVideoList((err, video) => {
        if (err) {
            console.log(err);
        }
        res.json(video);
    })
});

//get video by id
router.get('/videos/:_id', function (req, res) {
    Video.getVideoByID(req.params._id, function (err, video) {
        if (err) {
            console.log(err);
        }
        res.json(video);
    })
});

// add video
router.post('/videos',verifyToken , function (req, res) {
    const videoAdded = req.body;
    Video.addVideo(videoAdded, function (err, video) {
        if (err) {
            console.log(err);
        }
        res.json(video);
    })
});

//update video
router.put('/videos/:_id',verifyToken , function (req, res) {
    const id = req.params._id;
    const videoAdded = req.body;
    Video.updateVideo(id, videoAdded, {}, function (err, video) {
        if (err) {
            console.log(err);
        }
        res.json(video);
    })
});

//delete video
router.delete('/videos/:_id',verifyToken , function (req, res) {
    const id = req.params._id;
    Video.deleteVideo(id, function (err, video) {
        if (err) {
            console.log(err);
        }
        res.json(video);
    })
});

//get video By category
router.get("/getVideo", function (req, res) {
    const loTag = req.query.localeTag;
    const tyTag = req.query.typeTag;
    const limit = req.query.limit;
    Video.findVideoByTag(loTag, tyTag, function (err, video) {
        if (err) {
            console.log(err);
        }
        res.json(video);
    }, parseInt(limit))
});

router.get("/getVideoLocaleOnly", function (req, res) {
    const loTag = req.query.localeTag;
    const limit = req.query.limit;
    Video.findVideoByLocale(loTag, function (err, video) {
        if (err) {
            console.log(err);
        }
        res.json(video);
    }, parseInt(limit))
});

router.get("/getVideoTypeOnly", function (req, res) {
    const tyTag = req.query.typeTag;
    const limit = req.query.limit;
    Video.findVideoByType(tyTag, function (err, video) {
        if (err) {
            console.log(err);
        }
        res.json(video);
    }, parseInt(limit))
});

router.get("/searchVideo", (req, res) => {
    const patten = req.query.patten;
    const languateTag = req.query.languageTag;
    const limit = req.query.limit;
    const skip = req.query.skip;
    Video.searchVideo(languateTag, patten, (err, video) => {
        if (err) {
            console.log(err);
        }
        res.json(video);
    }, parseInt(skip), parseInt(limit))
});

router.get('/searchVideoTime', (req,res) => {
    const from = req.query.from;
    const to = req.query.to;
    Video.searchVideoTime(from,to,(err,videos)=>{
        if(err){
            console.log(err);
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
router.get('/flash', function (req, res) {
    const leTag = req.query.languageTag;
    NewsFlash.getFlashList(leTag, function (err, newsFlash) {
        if (err) {
            console.log(err);
        }
        res.json(newsFlash);
    })
});

//get newsFlash by ID
router.get('/flashList/:_id', function (req, res) {
    NewsFlash.getFlashByID(req.params._id, function (err, newsFlash) {
        if (err) {
            console.log(err);
        }
        res.json(newsFlash);
    })
});

router.get('/flashList', function (req, res) {
    NewsFlash.getFlash((err, newsFlash) => {
        if (err) {
            console.log(err);
        }
        res.json(newsFlash);
    })
});



//add News Flash
router.post('/flash',verifyToken , function (req, res) {
    const flashAdded = req.body;
    NewsFlash.addFlashNews(flashAdded, function (err, flashAdded) {
        if (err) {
            console.log(err);
        }
        res.json(flashAdded);
    })
});

//update News Flash
router.put('/flash/:_id',verifyToken , function (req, res) {
    const id = req.params._id;
    const flashAdded = req.body;
    NewsFlash.updateFlashNews(id, flashAdded, {}, function (err, flash) {
        if (err) {
            console.log(err);
        }
        res.json(flash);
    })
});

//delete News Flash
router.delete('/flash/:_id',verifyToken , function (req, res) {
    const id = req.params._id;
    NewsFlash.deleteFlash(id, function (err, newsFlash) {
        if (err) {
            console.log(err);
        }
        res.json(newsFlash);
    })
});

router.get("/searchFlash", (req, res) => {
    const patten = req.query.patten;
    const languateTag = req.query.languageTag;
    const limit = req.query.limit;
    const skip = req.query.skip;
    NewsFlash.searchFlashNews(languateTag, patten, (err, flash) => {
        if (err) {
            console.log(err);
        }
        res.json(flash);
    }, parseInt(skip), parseInt(limit))
});

router.get('/searchFlashTime', (req,res)=>{
    const from = req.query.from;
    const to = req.query.to;
    NewsFlash.searchFlashTime( from,to,(err,flash)=>{
        if(err){
            console.log(err);
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
router.get('/genuine', function (req, res) {
    Genuine.getGenuineList(function (err, genuine) {
        if (err) {
            console.log(err);
        }
        res.json(genuine);
    })
});

//get Genuine By ID
router.get('/genuine/:_id', function (req, res) {
    Genuine.getGenuineByID(req.params._id, function (err, genuine) {
        if (err) {
            console.log(err);
        }
        res.json(genuine);
    })
});

// add genuine news
router.post('/genuine',verifyToken , function (req, res) {
    const genuineAdd = req.body;
    Genuine.addGenuine(genuineAdd, function (err, genuine) {
        if (err) {
            console.log(err);
        }
        res.json(genuine);
    })
});

//Update genuine
router.put('/genuine/:_id',verifyToken , function (req, res) {
    const id = req.params._id;
    const genuineAdd = req.body;
    Genuine.updateGenuine(id, genuineAdd, {}, function (err, genuine) {
        if (err) {
            console.log(err);
        }
        res.json(genuine);
    })
});

//delete genuine
router.delete('/genuine/:_id',verifyToken , function (req, res) {
    const id = req.params._id;
    Genuine.deleteGenuine(id, function (err, genuine) {
        if (err) {
            console.log(err);
        }
        res.json(genuine);
    })
});

//get genuine news by Category
router.get("/getgenuine", function (req, res) {
    const geTag = req.query.genuineTag;
    const leTag = req.query.languageTag;
    const limit = req.query.limit;
    const skip = req.query.skip;
    Genuine.findGenuineByTag(geTag, leTag, function (err, genuine) {
        if (err) {
            console.log(err);
        }
        res.json(genuine);
    }, parseInt(skip), parseInt(limit))
});

// search genuine objects
router.get("/searchgenuine", (req, res) => {
    const patten = req.query.patten;
    const languageTag = req.query.languageTag;
    const limit = req.query.limit;
    const skip = req.query.skip;
    Genuine.searchGenuine(languageTag, patten, (err, genuine) => {
        if (err) {
            console.log(err);
        }
        res.json(genuine);
    }, parseInt(skip), parseInt(limit))
});

router.get('/searchGenuineTime',(req,res)=>{
    const from = req.query.from;
    const to = req.query.to;
    Genuine.searchGenuineTime(from,to,(err,genuine)=>{
        if(err){
            console.log(err);
        }
        res.json(genuine);
    })
});

/* GENUINE PART ENDS */
/*----------------------------------------------------------------------------*/