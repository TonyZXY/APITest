var mongoose = require('mongoose');

var devicesiosSchema = mongoose.Schema({
    deviceID: {
        type: String,
        require: true
    },
    notification: {
        type: Boolean,
        require: true
    }
});


var IOSDevice = module.exports = mongoose.model('IOSDevice', devicesiosSchema);


module.exports.addDevice = (device, callback) => {
    IOSDevice.create(device, callback);
};


module.exports.getDeviceList = (callback) => {
    IOSDevice.find(callback);
};

module.exports.updateNotificationStatus = (deviceID, callback) => {
    IOSDevice.findOne({deviceID: deviceID}, (err, device) => {
        device.notification = !device.notification;
        IOSDevice.findOneAndUpdate({deviceID: deviceID}, device, {}, callback);
    })
};

module.exports.getDevice = (deviceID, callback) => {
    IOSDevice.find({deviceID: deviceID}, callback);
};