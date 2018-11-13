const mongoose = require('mongoose');


const GameNotificationSchema = mongoose.Schema({
    shortMassage: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    publishedTime: {
        type: Date,
        default: Date.now
    },
    timeTo: {
        type: Date,
        require: true
    },
    timeFrom: {
        type: Date,
        require: true
    }
});

const GameNotification = module.exports = mongoose.model('GameNotification',GameNotificationSchema);

module.exports = {
    addNewNotification: (notification,callback)=>{
        GameNotification.create(notification,callback);
    },
    editNotification: (notificationToEdit,callback)=>{
        GameNotification.findOneAndUpdate({_id:notificationToEdit._id},notificationToEdit,{upsert:true,returnNewDocument:true},callback);
    },
    getNotifications: (callback)=>{
        let dateNow = new Date();
        GameNotification.find({
            "timeFrom": {
                "$lt": dateNow
            },
            "timeTo": {
                "$gte": dateNow
            }
        },callback);
    },
    deleteNotification: (id,callback)=>{
        GameNotification.remove({_id:id},callback);
    },
    getAllNotification: (callback)=>{
        GameNotification.find(callback);
    },
    getOneNotification: (id,callback)=>{
        GameNotification.findOne({_id:id},callback);
    }
};