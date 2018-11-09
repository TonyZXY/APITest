const FlashLater = require('../module/NewsFlashLater');
const Flash = require('../module/NewsFlash');

const mongoose = require('mongoose');
const config = require('../config');
const corn = require('node-cron');



mongoose.connect(config.database, config.options);


corn.schedule('* * * * *',()=>{
    FlashLater.getFlashList((err,dbmsg1)=>{
        if (err) {
            console.log(err);
        } else {
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
                    Flash.addFlashNews(flash,(err,dbmsg2)=>{
                        if (err){
                            console.log(err);
                        } else {
                            console.log(dbmsg2);
                            FlashLater.deleteFlash(element,(err,dbmsg3)=>{
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(dbmsg3);
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