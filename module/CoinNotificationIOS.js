
const mongoose = require('mongoose');

var coinNotificationIosDeviceSchema = mongoose.Schema({
    userID: {
        type: String,
        require: true
    },
    deviceID: {
        type: [String],
        require:true
    }
});

var NotificationIOS = module.exports = mongoose.model('coinNotificationIosDevice', coinNotificationIosDeviceSchema);

module.exports.getNotificationIOSDevice = (callback) => {
    NotificationIOS.find(callback);
};

module.exports.getNotificationIOSDeviceByUserID = (userID, callback) => {
    NotificationIOS.findOne({userID:userID}, callback)
}

