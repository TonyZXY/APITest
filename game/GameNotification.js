const mongoose = require('mongoose');

// this file is use to get and add and edit notification in game

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
    editNotification: (id,notificationToEdit,callback)=>{
        let edit = {
            shortMassage: notificationToEdit.shortMassage,
            title: notificationToEdit.title,
            timeFrom: notificationToEdit.timeFrom,
            timeTo: notificationToEdit.timeTo
        };
        GameNotification.findOneAndUpdate({_id:id},edit,{upsert:true,new:true},callback);
    },


    // get available notification, now time greater than from and not time lower than to
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