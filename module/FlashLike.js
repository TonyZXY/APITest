const mongoose = require('mongoose');
const db = require('../functions/postgredb');


const likeSchema = mongoose.Schema({
    newsID:{
        type:String,
        require: true
    },
    likes:{
        type:[String],
        require:true
    },
    dislikes:{
        type:[String],
        require:true
    }
});



const NewsLike = module.exports = mongoose.model('NewsLike',likeSchema);



module.exports.getLikes = (newsID,userEmail,callback)=>{
    NewsLike.findOne({
        newsID: newsID,
        likes:userEmail
    },callback);
};

module.exports.getDislike = (newsID,userEmail,callback)=>{
    NewsLike.findOne({
        newsID:newsID,
        dislikes:userEmail
    },callback);
};

module.exports.addNews = (like,callback) =>{
    NewsLike.create(like,callback);
};


module.exports.addLike = (newsID,userEmail,callback)=>{
    NewsLike.update(
        {newsID:newsID},
        {$push:{likes:userEmail}}
        ,callback);
};

module.exports.addDislike = (newsID,userEmail,callback)=>{
    NewsLike.update(
        {newsID:newsID},
        {$push:{dislikes:userEmail}},
        callback
    );
};


module.exports.removeLike = (newsID,userEmail,callback)=>{
    NewsLike.update(
        {newsID:newsID},
        {$pull:{likes:userEmail}},
        callback
    );
};

module.exports.removeDislike = (newsID,userEmail,callback)=>{
    NewsLike.update(
        {newsID:newsID},
        {$pull:{dislikes:userEmail}},
        callback
    );
};




