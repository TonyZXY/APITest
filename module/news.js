var mongoose = require('mongoose');

//news module 
var newsSchrma = mongoose.Schema({
    author: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    imageURL: {
        type: String,
        require: true
    },
    detail: {
        type: String,
        require: true
    },
    newsTag: {
        type: String,
        require: true
    },
    publishedTime: {
        type: Date,
        default: Date.now
    }
});

var News = module.exports = mongoose.model('News', newsSchrma);

// get news list
module.exports.getNewsList = function (callback, limit) {
    News.find(callback).limit(limit);
};

//get news by id
module.exports.getNewsByID = function (id, callback) {
    News.findById(id, callback);
};

//add news
module.exports.addNews = function (newsAdded, callback) {
    News.create(newsAdded, callback);
};

// update news
module.exports.updateNews = function (id, news, option, callback) {
    var query = {_id: id};
    var update = {
        author: news.author,
        title: news.title,
        description: news.description,
        imageURL: news.imageURL,
        detail: news.detail
    };
    News.findOneAndUpdate(query, update, option, callback);
};

//test API get last two
module.exports.getLastTwo = function (callback, limit) {
    News.find(callback).sort({_id: -1}).limit(limit);
};

// delete news
module.exports.deleteNews = function (id, callback) {
    var query = {_id: id};
    News.remove(query, callback);
};