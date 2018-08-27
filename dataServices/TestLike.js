const mongoose = require('mongoose');
const config = require('../config');
const NewsLike = require('../module/FlashLike');
const db = require('../functions/postgredb');

mongoose.connect(config.database);


function test () {
    let like = new NewsLike();
    like.newsID = '10000000000123456789';
    like.likes = ['test123456','test123456789','test34567890'];
    like.dislikes = ['dis12345','dis23456','dis34567'];

    NewsLike.addNews(like,(err,msg)=>{
        if (err) {
            console.log(err);
        } else {
            console.log(msg);
        }
    })
}



// test();


function find() {
    let newsID = '10000000000123456789';
    let email = 'test3232525';

    NewsLike.getLikes(newsID,email,(err,msg)=>{
        if (err) {
            console.log(err);
        } else {
            let exsit = msg !== null;
            console.log(exsit);
            console.log(msg);
        }
    })
}



function test2 () {
    let like = new NewsLike();
    like.newsID = '10000000000123456788';
    like.likes = ['test123456','test123456789','test34567890'];
    like.dislikes = ['dis12345','dis23456','dis34567'];

    NewsLike.addNews(like,(err,msg)=>{
        if (err) {
            console.log(err);
        } else {
            console.log(msg);
        }
    })
}


function testAdd() {
    let newsID = '10000000000123456789';
    let email = 'test3232525';

    NewsLike.addLike(newsID,email,(err,msg)=>{
        if (err) {
            console.log(err);
        } else {
            console.log(msg);
        }
    })
}


// testAdd();

// test2();

function addDislike() {
    let newsID = '10000000000123456789';
    let email = 'test3232525';

    NewsLike.getLikes(newsID,email,(err,li)=>{
        if (err) {
            console.log(err);
        } else {
            let liked = li !== null;
            console.log("liked: "+ liked);
            if (liked === true) {
                NewsLike.removeLike(newsID,email,(err,msg)=>{
                    if (err) {
                        console.log(err);
                    } else {
                        NewsLike.addDislike(newsID,email,(err,msg)=>{
                            if (err) {
                                 console.log(err);
                            } else {
                                console.log('successfully add dislike from remove like');
                            }
                        })
                    }
                })
            } else {
                NewsLike.getDislike(newsID,email,(err,dis)=>{
                    if (err) {
                        console.log(err);
                    } else {
                        let disliked = dis !== null;
                        console.log("disliked: "+ disliked);
                        if (disliked === true){
                            console.log("already disliked");
                        } else {
                            NewsLike.addDislike(newsID,email,(err,msg)=>{
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('successfully add dislike');
                                }
                            })
                        }
                    }
                })
            }
        }
    })
}


function addLike (){
    let newsID = '10000000000123456789';
    let email = 'test3232525';

    NewsLike.getDislike(newsID,email,(err,li)=>{ // check if dislike
        if (err) {
            console.log(err);
        } else {
            let disliked = li !== null;
            console.log("dislikedL: "+disliked);
            if (disliked===true) {
                NewsLike.removeDislike(newsID,email,(err,msg)=>{ // if true remove dislike
                    if (err){
                        console.log(err);
                    } else {
                        db.removeDislike(newsID,(err,dbmsg)=>{
                            if (err) {
                                console.log(err);
                            } else {
                                NewsLike.addLike(newsID,email,(err,msg)=>{ // after remove, add like
                                    if (err){
                                        console.log(err);
                                    } else {
                                        db.addLike(newsID,(err, dbmsg)=>{
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                console.log(dbmsg.rows[0]);
                                                console.log('successfully add from removing dislike');
                                            }
                                        });
                                    }
                                })
                            }
                        });
                    }
                })
            } else {
                NewsLike.getLikes(newsID,email,(err,di)=>{ // if not dislike, check if liked
                    if (err) {
                        console.log(err);
                    } else {
                        let liked = di !== null;
                        console.log("liked: "+ liked);
                        if ( liked=== true) { // if liked, return message
                            db.getLikesNumber(newsID,(err,dbmsg)=>{
                                if (err){
                                    console.log(err);
                                } else {
                                    console.log(dbmsg.rows[0]);
                                    console.log('already liked');
                                }
                            })
                        } else {
                            NewsLike.addLike(newsID,email,(err,msg)=>{ // if not liked, add to like list
                                if (err) {
                                    console.log(err);
                                } else {
                                    db.addLike(newsID,(err, dbmsg)=>{
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log(dbmsg.rows);
                                            console.log('successfully add');
                                        }
                                    });
                                }
                            })
                        }
                    }
                })
            }
        }
    })
}

find();


function testRemove() {
    let newsID = '10000000000123456789';
    let email = 'test3232525';

    NewsLike.removeLike(newsID,email,(err,msg)=>{
        if (err) {
            console.log(err);
        } else {
            console.log(msg);
        }
    });
}


addLike();
// testRemove();
// test();
// addDislike();
