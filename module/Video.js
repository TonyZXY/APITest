var mongoose = require('mongoose');

//video mudule
var videoSchrma = mongoose.Schema({
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
    }
});

var Video = module.exports = mongoose.model('Videos', videoSchrma);

// get video list
module.exports.getVideos = function (callback, limit) {
    Video.find(callback).limit(limit);
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
    var query = {_id: id};
    var update = {
        author: video.author,
        title: video.title,
        description: video.description,
        url: video.url,
        imageURL: video.imageURL,
        localeTag: video.localeTag,
        typeTag: video.typeTag
    };
    Video.findOneAndUpdate(query, update, option, callback);
};

// delete video
module.exports.deleteVideo = function (id, callback) {
    var query = {_id: id};
    Video.remove(query, callback);
};

// Get video by Tag
module.exports.findVideoByTag = function (localetag, typetag, callback, limit) {
    Video.find({localeTag: localetag, typeTag: typetag}, callback).sort({_id: -1}).limit(limit);
};

module.exports.findVideoByLocale = function (localetag, callback, limit) {
    Video.find({localeTag: localetag}, callback).sort({_id: -1}).limit(limit);
};

module.exports.findVideoByType = function (typetag, callback, limit) {
    Video.find({typeTag: typetag}, callback).sort({_id: -1}).limit(limit);
};