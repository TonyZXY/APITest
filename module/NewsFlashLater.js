const mongoose = require('mongoose');


const newsFlashLaterSchema = mongoose.Schema({
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
    },
    available:{
        type: Boolean,
        require: true
    },
    sendTime:{
        type: Date,
        require: true
    }
});

const NewsFlashLater = module.exports = mongoose.model('NewsFlashLater', newsFlashLaterSchema);


module.exports.getFlashList = (callback) =>{
    NewsFlashLater.find({
        'sendTime':{
            '$lt': Date.now()
        }
    },callback).sort({_id:-1})
};

module.exports.addFlash = (flash,callback) => {
    NewsFlashLater.create(flash,callback);
};

