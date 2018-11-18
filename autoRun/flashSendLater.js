const FlashLater = require('../module/NewsFlashLater');
const Flash = require('../module/NewsFlash');

const mongoose = require('mongoose');
const config = require('../config');
const corn = require('node-cron');
const logger = require('../functions/logger');
const Notification = require('./notification');  //require to send notification




// connect to mongodb
mongoose.connect(config.database, config.options);


// schedule the checking db function every min
corn.schedule('* * * * *',()=>{
    // check mongodb for news flash list
    FlashLater.getFlashList((err,dbmsg1)=>{
        if (err) {
            logger.databaseError("NewsFlash send Later","null","failed with getting flash list");
        } else {
            // if have news
            if (dbmsg1.length>0){
                dbmsg1.forEach( element => {
                    let flash = {
                        publishedTime: element.publishedTime,
                        title: element.title,
                        languageTag : element.languageTag,
                        toSent: element.toSent,
                        available: element.available,
                        shortMassage: element.shortMassage
                    };
                    // generate news flash add to Flash
                    Flash.addFlashNews(flash,(err,dbmsg2)=>{
                        if (err){
                            logger.databaseError("NewsFlash send Later","null","failed in add news flash");
                        } else {
                            FlashLater.deleteFlash(element,(err,dbmsg3)=>{
                                if (err) {
                                    logger.databaseError("NewsFlash send Later","null","failed in delete flash from list");
                                } else {
                                    // if need to push notification, push notification
                                    if(dbmsg2.toSent){
                                        Notification.sendFlashNotification(dbmsg2.title,dbmsg2.shortMassage);
                                        logger.newsFlashLog(null,'flash sent from send later');
                                    }
                                }
                            })
                        }
                    })
                })
            }
        }
    })
});



// NewsFlash.addFlashNews(flashAdded, function (err, flashAdded) {
//     if (err) {
//         console.log(err);
//         let address = req.connection.remoteAddress;
//         logger.databaseError('apifile',address, err);
//     }
//     res.json(flashAdded);
//     let address2 = req.connection.remoteAddress;
//     logger.newsFlashLog("NewsFlashApi",address2,"A News Flash added ("+flashAdded._id+")");
//     if(flashAdded.toSent){
//         Notification.sendFlashNotification(flashAdded.title,flashAdded.shortMassage);
//     }
//
// })