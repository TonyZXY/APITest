const mongoose = require('mongoose');

//news module
const newsSchema = mongoose.Schema({
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
        type: [String],
        require: true
    },
    publishedTime: {
        type: Date,
        require: true
    },
    languageTag: {
        type: String,
        require: true
    },
    source: {
        type: String,
        require: true
    }
});

const News = module.exports = mongoose.model('News', newsSchema);

// get news list
module.exports.getNewsList = function (callback, limit) {
    News.find(callback).sort({
        _id: -1
    }).limit(limit).sort({
        _id: -1
    });
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
    let query = {
        _id: id
    };
    let update = {
        author: news.author,
        title: news.title,
        newsDescription: news.newsDescription,
        imageURL: news.imageURL,
        url: news.url,
        localeTag: news.localeTag,
        contentTag: news.contentTag,
        languageTag: news.languageTag,
        source: news.source
    };
    News.findOneAndUpdate(query, update, option, callback);
};

//test API get last two
module.exports.getLastTwo = function (callback, limit) {
    News.find(callback).sort({
        _id: -1
    }).limit(limit);
};


// delete news
module.exports.deleteNews = function (id, callback) {
    let query = {
        _id: id
    };
    News.remove(query, callback);
};

// get News by category and limitation of number
module.exports.findNewsByTag = function (locaTag, contTag, languageTag, callback, limit) {
    News.find({
        localeTag: locaTag,
        contentTag: contTag,
        languageTag: languageTag
    }, callback).sort({
        _id: -1
    }).limit(limit);
};

module.exports.findNewsByLocal = function (locaTag, leTag, callback, skip, limit) {
    News.find({
        localeTag: locaTag,
        languageTag: leTag
    }, callback).sort({
        _id: -1
    }).skip(skip).limit(limit);
};

module.exports.findNewsByContent = function (leTag, callback, skip, limit) {
    News.find({
        languageTag: leTag
    }, callback).sort({
        publishedTime: -1
    }).skip(skip).limit(limit);
};

module.exports.searchNews = (languageTag, patten, callback, skip, limit) => {
    News.find({
        $or: [{
            title: {
                $regex: '.*' + patten + '.*',
                $options: 'i'
            }
        }, {
            newsDescription: {
                $regex: '.*' + patten + '.*'
            }
        }],
        languageTag: languageTag
    }, callback).sort({
        _id: -1
    }).skip(skip).limit(limit);
};

module.exports.searchNewsTime = (from, to, callback) => {
    let dateFrom = new Date(from);
    let dateTo = new Date(to);
    dateTo.setDate(dateTo.getDate() + 1);
    News.find({
        "publishedTime": {
            "$gte": dateFrom,
            "$lt": dateTo
        }
    }, callback).sort({
        _id: -1
    })
};
/**
 *  This is the Area that for testing code
 */

module.exports.findNews = (url, callback) => {
    // let reg = new RegExp(title.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'),'i');
    let date = new Date();
    date.setDate(date.getDate() - 14);
    News.findOne({
        url: url,
        publishedTime: {
            $gte: date
        }
    }, callback);
};

// module.exports.findNews = (tag,callback)=>{
//     News.find({
//         contentTag:{
//             $elemMatch:{
//                 $eq:tag
//             }
//         }
//     },callback).limit(10).sort({publishedTime:-1});
// };