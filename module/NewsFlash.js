var mongoose = require('mongoose');


//news flash module
var newsFlashSchrma = mongoose.Schema({
    shortMassage: {
        type: String,
        require: true
    },
    publishedTime: {
        type: Date,
        default: Date.now
    }
});


var NewsFlash = module.exports = mongoose.model('NewsFlash', newsFlashSchrma);


//get list
module.exports.getFlashList = function (callback, limit) {
    NewsFlash.find(callback).limit(limit);
};


//get by id
module.exports.getFlashByID = function (id, callback) {
    NewsFlash.findByID(id, callback);
};

//add Flash news
module.exports.addFlashNews = function (flashAdded, callback) {
    NewsFlash.create(flashAdded, callback);
};

//update flash News
module.exports.updateFlashNews = function (id, flash, option, callback) {
    var query = {_id: id};
    var update = {
        shortMassage: flash.shortMassage
    };
    NewsFlash.findOneAndUpdate(query, update, option, callback);
};

//delete news
module.exports.deleteFlash = function (id, callback) {
    var query = {_id: id};
    NewsFlash.remove(query, callback);
};