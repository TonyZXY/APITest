const mongoose = require('mongoose');


const updateSchema = mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    version:{
        type: String,
        require: true
    },
    info:{
        type: String,
        require: true
    },
    critical:{
        type: Boolean,
        require: true
    }
});


const UpdateInfo = module.exports = mongoose.model('UpdateInfo',updateSchema);


module.exports.getUpdate = (callback)=>{
    UpdateInfo.findOne({
        name:'update'
    },callback);
};


module.exports.setUpdate = (update,callback)=>{
    UpdateInfo.findOneAndUpdate({name:'update'},update,{new:true},callback);
};


module.exports.createUpdate = (update,callback)=>{
    UpdateInfo.create(update,callback);
};