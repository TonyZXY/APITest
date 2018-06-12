var mongoose = require('mongoose');


//news flash module
var newsFlashSchrma = mongoose.Schema({
    shortMassage:{
        type:String,
        require: true
    },
    publishedTime:{
        type: Date,
        default: Date.now
    },
    languageTag:{
        type:String,
        require:true
    }
});


var NewsFlash = module.exports = mongoose.model('NewsFlash',newsFlashSchrma);


//get list
module.exports.getFlashList = function (leTag ,callback,limit) {
    NewsFlash.find({languageTag:leTag},callback).limit(limit);
};

module.exports.getFlash = function (callback,limit) {
    NewsFlash.find(callback).limit(limit);
};

//get by id
module.exports.getFlashByID = function (id,callback) {
    NewsFlash.findById(id,callback);
};

//add Flash news
module.exports.addFlashNews = function (flashAdded,callback) {
    NewsFlash.create(flashAdded,callback);
};

//update flash News
module.exports.updateFlashNews = function (id,flash,option,callback) {
    var query = {_id:id};
    var update = {
        shortMassage:flash.shortMassage,
        languageTag:flash.languageTag
    };
    NewsFlash.findOneAndUpdate(query,update,option,callback);
};

module.exports.searchFlashNews = (languageTag,patten,callback,skip,limit)=>{
    NewsFlash.find({shortMassage:{$regex:'.*'+patten+'.*',$options:'i'},languageTag:languageTag},callback).sort({_id:-1}).skip(skip).limit(limit);
};

//delete news
module.exports.deleteFlash = function (id,callback) {
    var query = {_id:id};
    NewsFlash.remove(query,callback);
};