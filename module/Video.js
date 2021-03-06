const mongoose = require('mongoose');

//video mudule
const videoSchrma = mongoose.Schema({
    author: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    videoDescription: {
        type: String,
        require: true
    },
    url: {
        type: String,
        require: true
    },
    imageURL: {
        type: String,
        require: true
    },
    localeTag: {
        type: String,
        require: true
    },
    typeTag: {
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

const Video = module.exports = mongoose.model('Videos', videoSchrma);

// get video list
module.exports.getVideos = function (leTag, callback, skip, limit) {
    Video.find({languageTag: leTag}, callback).sort({_id: -1}).skip(skip).limit(limit);
};

module.exports.getVideoList = (callback, limit) => {
    Video.find(callback).limit(limit).sort({_id:-1});
};

// get video by ID
module.exports.getVideoByID = function (id, callback) {
    Video.findById(id, callback);
};

// add video
module.exports.addVideo = function (videoAdded, callback) {
    Video.create(videoAdded, callback);
};

// update video
module.exports.updateVideo = function (id, video, option, callback) {
    let query = {_id: id};
    let update = {
        author: video.author,
        title: video.title,
        videoeDescription: video.videoDescription,
        url: video.url,
        imageURL: video.imageURL,
        localeTag: video.localeTag,
        typeTag: video.typeTag,
        languageTag: video.languageTag
    };
    Video.findOneAndUpdate(query, update, option, callback);
};

// delete video
module.exports.deleteVideo = function (id, callback) {
    let query = {_id: id};
    Video.remove(query, callback);
};

// Get video by Tag
module.exports.findVideoByTag = function (localetag, typetag, languageTag, callback, limit) {
    Video.find({localeTag: localetag, typeTag: typetag, languageTag: languageTag}, callback).sort({_id: -1}).limit(limit);
};

module.exports.findVideoByLocale = function (localetag, callback, limit) {
    Video.find({localeTag: localetag}, callback).sort({_id: -1}).limit(limit);
};

module.exports.findVideoByType = function (typetag, laTag, callback, limit) {
    Video.find({typeTag: typetag,languageTag: laTag}, callback).sort({_id: -1}).limit(limit);
};

module.exports.searchVideo = (languageTag, patten, callback, skip, limit) => {
    Video.find({
        $or: [{
            title: {
                $regex: '.*' + patten + '.*',
                $options: 'i'
            }
        }, {videoDescription: {$regex: '.*' + patten + '.*'}}], languageTag: languageTag
    }, callback).sort({_id: -1}).skip(skip).limit(limit);
};

module.exports.searchVideoTime = (from, to, callback) => {
    let dateFrom = new Date(from);
    let dateTo = new Date(to);
    dateTo.setDate(dateTo.getDate() + 1);
    Video.find({
        'publishedTime':{
            '$gte': dateFrom,
            '$lt': dateTo
        }
    }, callback).sort({_id:-1})
};