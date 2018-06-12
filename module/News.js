var mongoose = require('mongoose');

//news module
var newsSchema = mongoose.Schema({
    author: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    newsDescription: {
        type: String,
        require: true
    },
    imageURL: {
        type: String,
        require: true
    },
    url: {
        type: String,
        require: true
    },
    localeTag: {
        type: String,
        require: true
    },
    contentTag: {
        type: String,
        require: true
    },
    publishedTime: {
        type: Date,
        default: Date.now
    },
    languageTag: {
        type: String,
        require: true
    }
});

var News = module.exports = mongoose.model('News', newsSchema);

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
        newsDescription: news.newsDescription,
        imageURL: news.imageURL,
        url: news.url,
        localeTag: news.localeTag,
        contentTag: news.contentTag,
        languageTag: news.languageTag
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

// get News by category and limitation of number
module.exports.findNewsByTag = function (locaTag, contTag, callback, limit) {
    News.find({localeTag: locaTag, contentTag: contTag}, callback).sort({_id: -1}).limit(limit);
};
module.exports.findNewsByLocal = function (locaTag, leTag, callback, skip, limit) {
    News.find({localeTag: locaTag, languageTag: leTag}, callback).sort({_id: -1}).skip(skip).limit(limit);
};

module.exports.findNewsByContent = function (contTag, leTag, callback, skip, limit) {
    News.find({contentTag: contTag, languageTag: leTag}, callback).sort({_id: -1}).skip(skip).limit(limit);
};

module.exports.searchNews = (languageTag, patten, callback, skip, limit) => {
    News.find({
        $or: [{
            title: {
                $regex: '.*' + patten + '.*',
                $options: 'i'
            }
        }, {newsDescription: {$regex: '.*' + patten + '.*'}}], languageTag: languageTag
    }, callback).sort({_id: -1}).skip(skip).limit(limit);
};
/**
 *  This is the Area that for testing code
 */