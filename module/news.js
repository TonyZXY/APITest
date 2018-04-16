var mongoose = require('mongoose');

//news module 
var newsSchrma = mongoose.Schema({
    title:{
        type:String,
        require: true
    },
    time:{
        type:String,
        require: true
    },
    image:{
        type:String,
        require: true
    },
    detilel:{
        type:String,
        require:true
    }
})

var News = module.exports = mongoose.model('News',newsSchrma);

// get news list
module.exports.getNewsList = function(callback,limit){
    News.find(callback).limit(limit);
}

//get news by id
module.exports.getNewsByID = function(id,callback){
    News.findById(id,callback);
}

//add news
module.exports.addNews = function(newsAdded, callback){
    News.create(newsAdded,callback);
}

// update news
module.exports.updateNews = function(id,news,option, callback){
    var query = {_id:id};
    var update = {
        title:news.title,
        detilel:news.detilel,
        image:news.image
    }
    News.findOneAndUpdate(query,update,option,callback);
}

// delete news
module.exports.deleteNews = function(id, callback){
    var query = {_id:id}
    News.remove(query,callback);
}