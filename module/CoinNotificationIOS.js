const mongoose = require('mongoose');

const coinNotificationIosDeviceSchema = mongoose.Schema({
    userID: {
        type: String,
        require: true
    },
    deviceID: {
        type: [String],
        require:true
    }
});

const NotificationIOS = module.exports = mongoose.model('coinNotificationIosDevice', coinNotificationIosDeviceSchema);

module.exports.getNotificationIOSDevice = (callback) => {
    NotificationIOS.find(callback);
};

module.exports.getNotificationIOSDeviceByUserID = (userID, callback) => {
    NotificationIOS.findOne({userID:userID}, callback)
};

module.exports.addNotificationIOSUser = (user, callback)=> {
            NotificationIOS.create(user,callback)
};

module.exports.findUser = (user,callback) => {
    NotificationIOS.findOne({userID:user.userID},callback)
};

module.exports.addDeviceTokenToUser = (user, deviceToken,callback) =>{
    NotificationIOS.findOneAndUpdate({userID:user.userID},{
        $push:{
            deviceID:deviceToken
        }
    },{new: true},callback)
};

module.exports.deleteDeviceByToken = (deviceToken,callback) =>{
    NotificationIOS.update(
        {},
        {$pull: {
            deviceID: deviceToken
        }},
        {multi: true},callback)
};
