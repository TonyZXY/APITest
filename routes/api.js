const express = require('express'); //express server
const router = express.Router();    //export router
const mongoose = require('mongoose');   //mongoose used to connect mongodb
const jwt = require('jsonwebtoken');    //json web token to send token
const Notification = require('../functions/notification');  //require to send notification
const logger = require('../functions/logger');  //logger
const db = require('../functions/postgredb');   //postgresql db connection


const config = require('../config');        //config files

mongoose.connect(config.database, config.options);  //connect to mongodb


module.exports = router;    //export router to app.js

const News = require('../module/News.js');          //News Schema and mongodb functions
const Video = require('../module/Video.js');        //Video
const NewsFlash = require('../module/NewsFlash.js');//NewsFlash
const Genuine = require('../module/Genuine.js');    //Genuine
const FlashLike = require('../module/FlashLike');   //FlashNews Like and dislike mongodb schema and functions
const UpdateInfo = require('../module/UpdateInfo'); //Update info for force update app (not used)
const Event = require('../module/Event');           //Event Schema and mongodb functions
const EventData = require('../dataServices/EventData'); //Use to get Event host name list and logo url
const FlashLater = require('../module/NewsFlashLater');
const GameNotification = require('../game/GameNotification');


// address = req.connection.remoteAddress

function verifyToken(req, res, next) {          //use to check user when post and put data into server
    let address = req.connection.remoteAddress;     // the user need to login via Admin page using the preset username and password
    if (!req.headers.authorization) {               // token need to be in the header and generate by server
        logger.newsFlashLog(address, "No authorization");       //if fail to pass token verifying, user are not allow to login or send data
        return res.status(401).json({
            login: false
        })
    } else {
        let userProfile = req.headers.authorization.split(' ')[1];  //split header to get token and key
        let token = req.headers.authorization.split(' ')[2];
        if (userProfile === null || userProfile === undefined ||
            token === null || token === undefined) {
            logger.newsFlashLog(address, "User Profile or token empty in User Profile: " + userProfile);
            return res.status(401).json({
                login: false
            })
        } else {
            let payload = jwt.verify(token, userProfile);       //decode token and get data stored in the token
            if (!payload) {
                logger.newsFlashLog(address, "No payload in User Profile: " + userProfile);
                return res.status(401).json({
                    login: false
                })
            } else {
                req.userID = payload.subject;           //decode payload to verify user
                if (payload.subject !== userProfile) {
                    logger.newsFlashLog(address, "Payload and user profile not match in User Profile: " + userProfile);
                    return res.status(401).json({
                        login: false
                    })
                } else {
                    next()      //when pass, can process next step
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
    News.getNewsList(function (err, newsList) { //function in News.js file
        if (err) {
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('apifile', address, err);
        }
        res.json(newsList); //get data and response the data
    })
});

//get news by ID
router.get('/news/:_id', function (req, res) {
    News.getNewsByID(req.params._id, function (err, news) {
        if (err) {
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('apifile', address, err);
        }
        res.json(news);
    })
});

//add news
router.post('/news', verifyToken, function (req, res) {
    const newsAdded = req.body;
    News.addNews(newsAdded, function (err, news) {
        if (err) {
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('apifile', address, err);
        }
        res.json(news);
    })
});

//update news
router.put('/news/:_id', verifyToken, function (req, res) {
    const id = req.params._id;
    const news = req.body;
    News.updateNews(id, news, {}, function (err, news) {
        if (err) {
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('apifile', address, err);
        }
        res.json(news);
    })
});

//delete news
router.delete('/news/:_id', verifyToken, function (req, res) {
    const id = req.params._id;
    News.deleteNews(id, function (err, news) {
        if (err) {
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('apifile', address, err);
        }
        res.json(news);
    })
});

//get news by category
router.get("/getNews", function (req, res) {
    const loTag = req.query.localeTag;  //get and check if information is currect
    const typeTag = req.query.contentTag;
    const lanTag = req.query.languageTag;
    const limit = req.query.limit;
    if (loTag === null || loTag === undefined || typeTag === null || typeTag === undefined || lanTag === null || lanTag === undefined) {
        res.status(400)
    } else {
        News.findNewsByTag(loTag, typeTag, lanTag, function (err, news) { //function in News.js file
            if (err) {
                console.log(err);
                let address = req.connection.remoteAddress;
                logger.databaseError('apifile', address, err);
            }
            res.json(news);
        }, parseInt(limit))
    }
});

// router.get("/getNewsLocaleOnly", function (req, res) {
//     const loTag = req.query.localeTag;
//     const leTag = req.query.languageTag;
//     const limit = req.query.limit;
//     const skip = req.query.skip;
//     News.findNewsByLocal(loTag, leTag, function (err, news) {
//         if (err) {
//             console.log(err);
//         }
//         res.json(news);
//     }, parseInt(skip), parseInt(limit))
// });
//
// router.get("/getNewsContentOnly", function (req, res) {
//     const typeTag = req.query.contentTag;
//     const leTag = req.query.languageTag;
//     const limit = req.query.limit;
//     const skip = req.query.skip;
//     if (typeTag === null || typeTag === undefined || leTag === null || leTag === undefined) {
//         res.status(400).send({
//             message: 'bad request'
//         });
//     } else {
//         News.findNewsByContent(typeTag, leTag, function (err, news) {
//             if (err) {
//                 console.log(err);
//             }
//             res.json(news);
//         }, parseInt(skip), parseInt(limit))
//     }
// });

router.get("/getNewsContentOnly", function (req, res) {
    const leTag = req.query.languageTag;
    const limit = req.query.limit;
    const skip = req.query.skip;
    if (leTag === null || leTag === undefined) {
        res.status(400).send({
            message: 'bad request'
        });
    } else {
        News.findNewsByContent(leTag, function (err, news) {
            if (err) {
                console.log(err);
                let address = req.connection.remoteAddress;
                logger.databaseError('apifile', address, err);
            }
            res.json(news);
        }, parseInt(skip), parseInt(limit))
    }
});

router.get("/getTags", (req, res) => {      //not used end point
    const tags = [{
        tag: 'tech',
        name: 'technology'
    }, {
        tag: 'crypto',
        name: 'crypto'
    }, {
        tag: 'business',
        name: 'business'
    }, {
        tag: 'general',
        name: 'general'
    }];
    res.json(tags);
});


// search news objects
router.get("/searchnews", (req, res) => {
    const patten = req.query.patten;
    const languageTag = req.query.languageTag;
    const limit = req.query.limit;
    const skip = req.query.skip;
    if (patten === null || patten === undefined || languageTag === null || languageTag === undefined) {
        res.status(400).send({
            message: 'bad request'
        });
    } else {
        News.searchNews(languageTag, patten, (err, news) => {   //see detail in News.js File
            if (err) {
                console.log(err);
                let address = req.connection.remoteAddress;
                logger.databaseError('apifile', address, err);
            }
            res.json(news);
        }, parseInt(skip), parseInt(limit))
    }
});

router.get("/searchNewsTime", (req, res) => {
    const from = req.query.from;
    const to = req.query.to;
    if (from === null || from === undefined || to === null || to === undefined) {
        res.status(400).send({message: 'bad request'});
    } else {
        News.searchNewsTime(from, to, (err, news) => {  //see detail in News.js File
            if (err) {
                console.log(err);
                let address = req.connection.remoteAddress;
                logger.databaseError('apifile', address, err);
            }
            res.json(news);
        })
    }

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
            let address = req.connection.remoteAddress;
            logger.databaseError('apifile', address, err);
        }
        res.json(video);
    }, parseInt(skip), parseInt(limit))
});

router.get('/video', (req, res) => {
    Video.getVideoList((err, video) => {
        if (err) {
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('apifile', address, err);
        }
        res.json(video);
    })
});

//get video by id
router.get('/videos/:_id', function (req, res) {
    Video.getVideoByID(req.params._id, function (err, video) {
        if (err) {
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('apifile', address, err);
        }
        res.json(video);
    })
});

// add video
router.post('/videos', verifyToken, function (req, res) {
    const videoAdded = req.body;
    Video.addVideo(videoAdded, function (err, video) {
        if (err) {
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('apifile', address, err);
        }
        res.json(video);
    })
});

//update video
router.put('/videos/:_id', verifyToken, function (req, res) {
    const id = req.params._id;
    const videoAdded = req.body;
    Video.updateVideo(id, videoAdded, {}, function (err, video) {
        if (err) {
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('apifile', address, err);
        }
        res.json(video);
    })
});

//delete video
router.delete('/videos/:_id', verifyToken, function (req, res) {
    const id = req.params._id;
    Video.deleteVideo(id, function (err, video) {
        if (err) {
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('apifile', address, err);
        }
        res.json(video);
    })
});

//get video By category
router.get("/getVideo", function (req, res) {
    const loTag = req.query.localeTag;
    const tyTag = req.query.typeTag;
    const lanTag = req.query.languageTag;
    const limit = req.query.limit;
    if (loTag === null || loTag === undefined || tyTag === null || tyTag === undefined || lanTag === null || lanTag === undefined) {
        res.status(400)
    } else {
        Video.findVideoByTag(loTag, tyTag, lanTag, function (err, video) {
            if (err) {
                console.log(err);
                let address = req.connection.remoteAddress;
                logger.databaseError('apifile', address, err);
            }
            res.json(video);
        }, parseInt(limit))
    }
});

router.get("/getVideoLocaleOnly", function (req, res) {
    const loTag = req.query.localeTag;
    const limit = req.query.limit;
    Video.findVideoByLocale(loTag, function (err, video) {
        if (err) {
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('apifile', address, err);
        }
        res.json(video);
    }, parseInt(limit))
});

router.get("/getVideoTypeOnly", function (req, res) {
    const tyTag = req.query.typeTag;
    const laTag = req.query.languageTag;
    const limit = req.query.limit;
    Video.findVideoByType(tyTag, laTag, function (err, video) {
        if (err) {
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('apifile', address, err);
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
            let address = req.connection.remoteAddress;
            logger.databaseError('apifile', address, err);
        }
        res.json(video);
    }, parseInt(skip), parseInt(limit))
});

router.get('/searchVideoTime', (req, res) => {
    const from = req.query.from;
    const to = req.query.to;
    Video.searchVideoTime(from, to, (err, videos) => {
        if (err) {
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('apifile', address, err);
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
    let address = req.connection.remoteAddress;
    NewsFlash.getFlashList(leTag, function (err, newsFlash) {
        if (err) {
            console.log(err);
            logger.databaseError('apifile', address, err);
        }
        res.json(newsFlash);
        logger.newsFlashLog(address, "Get All flash with language tag");
    })
});

//get newsFlash by ID
router.get('/flashList/:_id', function (req, res) {
    let address = req.connection.remoteAddress;
    NewsFlash.getFlashByID(req.params._id, function (err, newsFlash) {
        if (err) {
            console.log(err);
            logger.databaseError('apifile', address, err);
        }
        res.json(newsFlash);
        logger.newsFlashLog(address, "Get certain flash");
    })
});

router.get('/flashList', function (req, res) {  //use to get all NewsFlash
    let address = req.connection.remoteAddress;
    NewsFlash.getFlash((err, newsFlash) => {
        if (err) {
            console.log(err);
            logger.databaseError('apifile', address, err);
        }
        res.json(newsFlash);
        logger.newsFlashLog(address, "Get all flash");
    })
});


//add News Flash
router.post('/flash', verifyToken, function (req, res) {    //Add news flash
    const flashAdded = req.body;
    NewsFlash.addFlashNews(flashAdded, function (err, flashAdded) { //receive News Flash and add this into Mongodb
        if (err) {
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('apifile', address, err);
        }
        let like = new FlashLike(); //generate new flashLike Object
        like.newsID = flashAdded._id;
        like.likes = [];
        like.dislikes = [];
        FlashLike.addNews(like, (err, msg) => { // add Flash Like (people who like or dislike this news flash) list into Mongodb
            if (err) {
                console.log(err);
            } else {
                let id = flashAdded._id.toString();
                db.addNewsIntoList(id, (err, dbmsg) => { //add new line in postgresql db to store number of people like or dislike
                    if (err) {
                        console.log(err);
                    } else {
                        res.json(flashAdded);
                        let address2 = req.connection.remoteAddress;
                        logger.newsFlashLog("NewsFlashApi", address2, "A News Flash added (" + flashAdded._id + ")");
                        if (flashAdded.toSent) {
                            Notification.sendFlashNotification(flashAdded.title, flashAdded.shortMassage);
                        }
                    }
                })
            }
        });
    })
});

//update News Flash
router.put('/flash/:_id', verifyToken, function (req, res) {    //see NewsFlash.js file
    const id = req.params._id;
    const flashAdded = req.body;
    let address = req.connection.remoteAddress;
    NewsFlash.updateFlashNews(id, flashAdded, {}, function (err, flash) {
        if (err) {
            console.log(err);
            logger.databaseError('apifile', address, err);
        }
        res.json(flash);
        logger.newsFlashLog(address, "Update one flash");
    })
});

//delete News Flash
router.delete('/flash/:_id', verifyToken, function (req, res) {
    const id = req.params._id;
    let address = req.connection.remoteAddress;
    NewsFlash.deleteFlash(id, function (err, newsFlash) {
        if (err) {
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('apifile', address, err);
        }
        res.json(newsFlash);
        logger.newsFlashLog(address, "Delete one flash");
    })
});

router.get("/searchFlash", (req, res) => {
    const patten = req.query.patten;
    const languateTag = req.query.languageTag;
    const limit = req.query.limit;
    const skip = req.query.skip;
    let address = req.connection.remoteAddress;
    NewsFlash.searchFlashNews(languateTag, patten, (err, flash) => {
        if (err) {
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('apifile', address, err);
        }
        res.json(flash);
        logger.newsFlashLog(address, "Search flash news");
    }, parseInt(skip), parseInt(limit))
});

router.get("/searchFlashByTag", (req, res) => {
    const toSent = req.query.sentTag;
    const languateTag = req.query.languageTag;
    const limit = req.query.limit;
    const skip = req.query.skip;
    NewsFlash.findFlashByType(toSent, languateTag, (err, flash) => {
        if (err) {
            console.log(err);
        }
        res.json(flash);
    }, parseInt(skip), parseInt(limit))
});

router.get('/searchFlashTime', (req, res) => {
    const from = req.query.from;
    const to = req.query.to;
    let address = req.connection.remoteAddress;
    NewsFlash.searchFlashTime(from, to, (err, flash) => {
        if (err) {
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('apifile', address, err);
        }
        res.json(flash);
        logger.newsFlashLog(address, "Search flash by time");
    })
});

router.get('/getFlashWithLan', (req, res) => {  // this func used in iOS app to get all news flash in different language tag
    const languageTag = req.query.languageTag;
    const skip = req.query.skip;
    const limit = req.query.limit;
    let address = req.connection.remoteAddress;
    NewsFlash.getFlashListWithLimit(languageTag, parseInt(skip), parseInt(limit), (err, flash) => { //get NewsFlash from mongodb
        if (err) {
            console.log(err);
            logger.databaseError('apifile', address, err);
        }
        let ids = [];
        let flashToString = JSON.stringify(flash);
        let flashToSent = JSON.parse(flashToString);
        flashToSent.forEach(element => {
            ids.push(element._id);
        });
        let likes = [];
        db.getLikesNumberList(ids, (err, dbmsg) => { // get Number of like and dislike from postgresql db for each flash
            likes = dbmsg.rows;
            flashToSent.forEach(flashToEdit => { // add each number with their news flash
                likes.forEach(e => {
                    if (e.news_id.toString() === flashToEdit._id.toString()) {
                        flashToEdit.like = e.likes;
                        flashToEdit.dislike = e.dislikes;
                    }
                })
            });
            res.json(flashToSent); //send to ios devices
        });
        logger.newsFlashLog(address, "Get Flash with SKIP and LIMIT");
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
            let address = req.connection.remoteAddress;
            logger.databaseError('apifile', address, err);
        }
        res.json(genuine);
    })
});

//get Genuine By ID
router.get('/genuine/:_id', function (req, res) {
    Genuine.getGenuineByID(req.params._id, function (err, genuine) {
        if (err) {
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('apifile', address, err);
        }
        res.json(genuine);
    })
});

// add genuine news
router.post('/genuine', verifyToken, function (req, res) {
    const genuineAdd = req.body;
    Genuine.addGenuine(genuineAdd, function (err, genuine) {
        if (err) {
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('apifile', address, err);
        }
        res.json(genuine);
    })
});

//Update genuine
router.put('/genuine/:_id', verifyToken, function (req, res) {
    const id = req.params._id;
    const genuineAdd = req.body;
    Genuine.updateGenuine(id, genuineAdd, {}, function (err, genuine) {
        if (err) {
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('apifile', address, err);
        }
        res.json(genuine);
    })
});

//delete genuine
router.delete('/genuine/:_id', verifyToken, function (req, res) {
    const id = req.params._id;
    Genuine.deleteGenuine(id, function (err, genuine) {
        if (err) {
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('apifile', address, err);
        }
        res.json(genuine);
    })
});

//get genuine news by Category
router.get("/getgenuine", function (req, res) {
    // const geTag = req.query.genuineTag;
    const leTag = req.query.languageTag;
    const limit = req.query.limit;
    const skip = req.query.skip;
    if (leTag === null || leTag === undefined) {
        res.status(400)
    } else {
        Genuine.findGenuineByTag(leTag, function (err, genuine) {
            if (err) {
                console.log(err);
                let address = req.connection.remoteAddress;
                logger.databaseError('apifile', address, err);
            }
            res.json(genuine);
        }, parseInt(skip), parseInt(limit))
    }
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
            let address = req.connection.remoteAddress;
            logger.databaseError('apifile', address, err);
        }
        res.json(genuine);
    }, parseInt(skip), parseInt(limit))
});

router.get('/searchGenuineTime', (req, res) => {
    const from = req.query.from;
    const to = req.query.to;
    Genuine.searchGenuineTime(from, to, (err, genuine) => {
        if (err) {
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('apifile', address, err);
        }
        res.json(genuine);
    })
});

/* GENUINE PART ENDS */
/*----------------------------------------------------------------------------*/


router.post('/update', verifyToken, (req, res) => {
    let update = req.body;
    UpdateInfo.setUpdate(update, (err, msg) => {
        if (err) {
            console.log(err);
        } else {
            res.json(msg);
        }
    })
});


router.get('/update', (req, res) => {
    let address = req.connection.remoteAddress;
    UpdateInfo.getUpdate((err, msg) => {
        if (err) {
            console.log(err);
            logger.databaseError('apifile', address, err);
        } else {
            res.json(msg);
        }
    })
});

router.get('/eventAll',(req,res)=>{ //get all event from mongodb (V1)
    let address = req.connection.address;
    Event.getAllEvent((err,msg)=>{
        if (err){
            console.log(err);
        } else {
            res.json(msg);
        }
    })
});

router.get('/eventAllV2', (req, res) => { //get all event from mongodb (V2) with host logoURL list and default logoURL
    let address = req.connection.remoteAddress;
    let hosts = EventData.hosts;
    let urls = [];
    hosts.forEach(host =>{ //get Event host list and their logoURLs
        let url = {
            name:host.name,
            logoURL:host.logoURL
        };
        urls.push(url);
    });
    urls.push({
        name:'default',
        logoURL:'https://firebasestorage.googleapis.com/v0/b/email-app-6e8c9.appspot.com/o/kisspng-calendar-date-computer-icons-clip-art-calendar-5abbfbe7cd01e5.3454946815222691598397.png?alt=media&token=1bc76d95-94f4-4a2b-b9fd-1f5b448e4e1d'
    });

    Event.getAllEvent((err, msg) => { //Get All Events
        if (err) {
            console.log(err);
        } else {
            res.send({
                success: true,
                message: "successfully get events",
                code: 200,
                data: {
                    events: msg, // combine events with url lists
                    url:urls
                }
            });
        }
    })
});


// get specific host's event
router.get('/event/:host', (req, res) => {
    let host = req.params.host;
    let hostToServer = '';
    if (host === 'BCC') {
        hostToServer = 'The Blockchain Centre';
    }
    Event.getEventList(hostToServer, (err, msg) => {
        if (err) {
            console.log(err);
        } else {
            res.json(msg);
        }
    })
});



router.post('/addEvent',verifyToken, (req,res)=>{
    let event = req.body;
    Event.addEvent(event,(err,dbmsg)=>{
        if (err){
            console.log(err);
        } else {
            console.log(dbmsg);
            res.send("ojbk");
        }
    })
});


router.get('/getEvent/:id',(req,res)=>{
    let ID = req.params.id;
    Event.getOneEvent(ID,(err,msg)=>{
        if (err){
            console.log(err);
        } else {
            res.send(msg);
        }
    })
});


router.put('/event', verifyToken,(req,res)=>{
    let event = req.body;
    Event.addEvent(event,(err,msg)=>{
        if (err){
            console.log(err);
        } else {
            res.send(msg);
        }
    })
});


// add game notification from admin
router.post('/gameNoti', verifyToken, (req, res) => {
    let noti = req.body;
    GameNotification.addNewNotification(noti, (err, monmsg) => {
        if (err) {
            res.send({
                message: "database error",
                code: 500,
                success: false,
                data: null
            })
        } else {
            res.send({
                message: 'Successfully get available Notification',
                code: 200,
                success: true,
                data: monmsg
            });
        }
    })
});


router.get('/gameNoti/:_id', (req, res) => {
    let id = req.params._id;
    if (id === null || id === undefined) {
        res.send({
            message: "bad request",
            code: 500,
            success: false,
            data: null
        })
    } else {
        GameNotification.getOneNotification(id, (err, monmsg) => {
            if (err) {
                res.send({
                    message: "database error",
                    code: 500,
                    success: false,
                    data: null
                })
            } else {
                res.send({
                    message: 'Successfully get One Notification',
                    code: 200,
                    success: true,
                    data: monmsg
                });
            }
        })
    }
});


// update game notification
router.put('/gameNoti/:_id', verifyToken, (req, res) => {
    let id = req.params._id;
    if (id === null || id === undefined) {
        res.send({
            message: "bad request",
            code: 500,
            success: false,
            data: null
        })
    } else {
        let toEdit = req.body;
        GameNotification.editNotification(id,toEdit, (err, monmsg) => {
            if (err) {
                res.send({
                    message: "database error",
                    code: 500,
                    success: false,
                    data: null
                })
            } else {
                res.send({
                    message: 'successfully edit notification',
                    code: 200,
                    success: false,
                    data: monmsg
                })
            }
        })
    }
});



//delete game notification
router.delete('/gameNoti/:_id', verifyToken, (req, res) => {
    let id = req.params._id;
    if (id === null || id === undefined) {
        res.send({
            message: "bad request",
            code: 500,
            success: false,
            data: null
        })
    } else {
        GameNotification.deleteNotification(id,(err,monmsg)=>{
            if (err){
                res.send({
                    message: "database error",
                    code: 500,
                    success: false,
                    data: null
                })
            } else {
                res.send({
                    message: 'successfully delete notification',
                    code: 200,
                    success: false,
                    data: monmsg
                })
            }
        })
    }
});



// add news flash with delay
router.post('/flashWithTime',verifyToken,(req,res)=>{       //use to receive delay news flash
    let flash = req.body;
    if (flash.time ===null || flash.time === undefined){        //if not set time, sent now
        NewsFlash.addFlashNews(flash, function (err, flashAdded) {
            if (err) {
                console.log(err);
                let address = req.connection.remoteAddress;
                logger.databaseError('apifile',address, err);
            }
            res.json(flashAdded);
            let address2 = req.connection.remoteAddress;
            logger.newsFlashLog("NewsFlashApi",address2,"A News Flash added ("+flashAdded._id+")");
            if(flashAdded.toSent){
                Notification.sendFlashNotification(flashAdded.title,flashAdded.shortMassage);
            }
        })
    } else {
        sendAfter(flash,req,res); // if set time, sent after
        logger.newsFlashLog(null ,"message will be send after: "+flash.title);
    }
});


function sendAfter(flashAdded,req,res) {
    // delay(time).then(()=>{ //set time delay then push notification
    //     let address = req.connection.remoteAddress;
    //     NewsFlash.addFlashNews(flashAdded, function (err, flashAdded) {
    //         if (err) {
    //             console.log(err);
    //             logger.databaseError('apifile',address, err);
    //         }
    //         res.json(flashAdded);
    //         logger.newsFlashLog("NewsFlashApi",address,"A News Flash added ("+flashAdded._id+")");
    //         if(flashAdded.toSent){
    //             Notification.sendFlashNotification(flashAdded.title,flashAdded.shortMassage);
    //         }
    //
    //     })
    // })
    let address = req.connection.remoteAddress;
    flashAdded.publishedTime = flashAdded.time;
    FlashLater.addFlash(flashAdded,(err,monmsg)=>{
        if (err) {
            res.send({
                success: false,
                message: "database err",
                code: 500,
                data: null
            });
            logger.databaseError('apifile',address, err);
        } else {
            logger.newsFlashLog("NewsFlashApi",address,"A News Flash added ("+monmsg._id+")");
            res.json(monmsg);
        }
    });
}

const delay = (amount) => {
    return new Promise((resolve) => {
        setTimeout(resolve, amount);
    });
};













