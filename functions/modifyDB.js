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
            like.newsID = flash._id;
            like.likes = [];
            like.dislikes = [];
            FlashLike.addNews(like,(err,mmsg)=>{
                if (err) {
                    console.log(err);
                } else {
                    console.log(flash._id);
                    let id = flash._id.toString();
                    db.addNewsIntoList(id,(err,dbmsg)=>{
                        if (err){
                            console.log(err);
                        } else {
                            console.log(dbmsg.rows[0]);
                        }
                    })
                }
            })
        })
    })
}


modify();