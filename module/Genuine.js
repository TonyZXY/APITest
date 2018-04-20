var mongoose = require('mongoose');

//genuine module
var genuineSchema = mongoose.Schema({
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
    genuineTag: {
        type: String,
        require: true
    },
    publishedTime: {
        type: Date,
        default: Date.now
    }
});

var Genuine = module.exports = mongoose.model('Genuine', genuineSchema);


//get Genuine list
module.exports.getGenuineList = function (callback, limit) {
    Genuine.find(callback).limit(limit);
};

//get Genuine by ID
module.exports.getGenuineByID = function (id, callback) {
    Genuine.findById(id, callback);
};

//add Genuine message
module.exports.addGenuine = function (genuine, callback) {
    Genuine.create(genuine, callback);
};

//update Genuine message
module.exports.updateGenuine = function (id, genuine, option, callback) {
    var query = {_id: id};
    var update = {
        author: genuine.author,
        title: genuine.title,
        description: genuine.description,
        imageURL: genuine.imageURL,
        detail: genuine.detail,
        genuineTag: genuine.genuineTag,
    };
    Genuine.findOneAndUpdate(query, update, option, callback);
};

//delete genuine
module.exports.deleteGenuine = function (id, callback) {
    var query = {_id: id};
    Genuine.remove(query, callback);
};

// get Genuine by Tag
module.exports.findGenuineByTag = function (geuninetag, callback, limit) {
    Genuine.find({genuineTag: geuninetag}, callback).sort({_id: -1}).limit(limit);
};


/**
 *  Please place your Test code here
 */

