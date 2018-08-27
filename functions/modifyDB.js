const Flash = require('../module/NewsFlash');
const config = require('../config');
const db = require('../functions/postgredb');
const FlashLike = require('../module/FlashLike');


const mongoose = require('mongoose');

mongoose.connect(config.database, config.options);

function modify(){
    Flash.getFlash((err,flashs)=>{
        flashs.forEach(flash=>{
            let like = new FlashLike();
            like.news_id = flash._id;
            like.likes = [];
            like.dislikes = [];
            FlashLike.addNews(like,(err,mmsg)=>{
                if (err) {
                    console.log(err);
                } else {
                    console.log(flash._id);
                    db.addNewsIntoList(flash._id,(err,dbmsg)=>{
                        if (err){
                            console.log(err);
                        } else {
                            console.log(flash.title+' DONE');
                        }
                    })
                }
            })
        })
    })
}


modify();