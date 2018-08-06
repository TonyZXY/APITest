const mongoose = require('mongoose');


//news flash module
const newsFlashSchrma = mongoose.Schema({
    shortMassage:{
        type:String,
        require: true
    },
    title:{
        type:String,
        require:true
    },
    publishedTime:{
        type: Date,
        default: Date.now
    },
    languageTag:{
        type:String,
        require:true
    },
    toSent:{
        type: Boolean,
        require: true
    }
});


const NewsFlash = module.exports = mongoose.model('NewsFlash',newsFlashSchrma);


//get list
module.exports.getFlashList = function (leTag ,callback,limit) {
    NewsFlash.find({languageTag:leTag},callback).limit(limit).sort({_id:-1});
};

module.exports.getFlash = function (callback,limit) {
    NewsFlash.find(callback).limit(limit).sort({_id:-1});
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
    let query = {_id:id};
    let update = {
        shortMassage:flash.shortMassage,
        title:flash.title,
        languageTag:flash.languageTag,
        toSent: flash.toSent
    };
    NewsFlash.findOneAndUpdate(query,update,option,callback);
};

module.exports.searchFlashNews = (languageTag,patten,callback,skip,limit)=>{
    NewsFlash.find({
        $or:[{
            shortMassage:
                {
                    $regex:'.*'+patten+'.*',
                    $options:'i'
                },
            title:
                {
                    $regex: '.*'+ patten + '.*',
                    $options: 'i'
                }
        }],
        languageTag:languageTag
    },callback).sort({_id:-1}).skip(skip).limit(limit);
};

//delete news
module.exports.deleteFlash = function (id,callback) {
    let query = {_id:id};
    NewsFlash.remove(query,callback);
};

module.exports.findFlashByType = function (toSent, laTag, callback, limit) {
    NewsFlash.find({toSent: toSent,languageTag: laTag}, callback).sort({_id: -1}).limit(limit);
};

module.exports.searchFlashTime = (from, to, callback) =>{
    let dateFrom = new Date(from);
    let dateTo = new Date(to);
    dateTo.setDate(dateTo.getDate() + 1);
    NewsFlash.find({
        'publishedTime': {
            '$gte': dateFrom,
            '$lt': dateTo
        }
    },callback).sort({_id:-1})
};