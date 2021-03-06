const mongoose = require('mongoose');

//genuine module
const genuineSchema = mongoose.Schema({
    author: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    genuineDescription: {
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
    genuineTag: {
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

const Genuine = module.exports = mongoose.model('Genuine', genuineSchema);


//get Genuine list
module.exports.getGenuineList = function (callback, limit) {
    Genuine.find(callback).limit(limit).sort({_id:-1});
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
    let query = {_id: id};
    let update = {
        author: genuine.author,
        title: genuine.title,
        genuineDescription: genuine.genuineDescription,
        imageURL: genuine.imageURL,
        url: genuine.url,
        genuineTag: genuine.genuineTag,
        languageTag: genuine.languageTag
    };
    Genuine.findOneAndUpdate(query, update, option, callback);
};

//delete genuine
module.exports.deleteGenuine = function (id, callback) {
    let query = {_id: id};
    Genuine.remove(query, callback);
};

// get Genuine by Tag
module.exports.findGenuineByTag = function (geunineTag, languageTag, callback, skip, limit) {
    Genuine.find({genuineTag: geunineTag, languageTag: languageTag}, callback).sort({_id: -1}).skip(skip).limit(limit);
};

// this method used to search genuine news
module.exports.searchGenuine = (languageTag, patten, callback, skip, limit) => {
    Genuine.find({
        $or: [{
            title: {
                $regex: '.*' + patten + '.*',
                $options: 'i'
            }
        }, {genuineDescription: {$regex: '.*' + patten + '.*'}}], languageTag: languageTag
    }, callback).sort({_id: -1}).skip(skip).limit(limit);
};

module.exports.searchGenuineTime = (from, to, callback) => {
    let dateFrom = new Date(from);
    let dateTo = new Date(to);
    dateTo.setDate(dateTo.getDate() + 1);
    Genuine.find({
        'publishedTime': {
            '$gte': dateFrom,
            '$lt': dateTo
        }
    },callback).sort({_id:-1})
};


/**
 *  Please place your Test code here
 */