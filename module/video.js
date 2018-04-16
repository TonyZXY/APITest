var mongoose = require('mongoose');

//video mudule
var videoSchrma = mongoose.Schema({
    name:{
        type:String,
        require: true
    },
    url:{
        type:String,
        require: true
    }
})

var Video = module.exports = mongoose.model('Video',videoSchrma);

// get video list
module.exports.getVideos = function(callback,limit){
    Video.find(callback).limit(limit);
}

// get video by ID
module.exports.getVideoByID = function(id,callback){
    Video.findById(id,callback);
}

// add video
module.exports.addVideo = function(videoAdded, callback){
    Video.create(videoAdded,callback);
}

// update video
module.exports.updateVideo = function(id,video,option, callback){
    var query = {_id:id};
    var update = {
        name:video.name
    }
    Video.findOneAndUpdate(query,update,option,callback);
}

// delete video
module.exports.deleteVideo = function(id, callback){
    var query = {_id:id}
    Video.remove(query,callback);
}