const mongoose = require('mongoose');

const devicesiosSchema = mongoose.Schema({
    deviceID: {
        type: String,
        require: true
    },
    notification: {
        type: Boolean,
        require: true
    }
});


const IOSDevice = module.exports = mongoose.model('IOSDevice', devicesiosSchema);


module.exports.addDevice = (device, callback) => {
    IOSDevice.create(device, callback);
};
module.exports.getDeviceByToken = (deviceToken, callback) => {
    IOSDevice.findOne({deviceID: deviceToken}, callback);
}


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
    IOSDevice.findOne({deviceID: deviceID}, callback);
};

module.exports.deleteDevice = (id, callback) => {
    let query = {
        _id:id
    };
    IOSDevice.remove(query,callback);
};

module.exports.deleteDeviceByToken = (deviceID,callback) => {
    IOSDevice.findOneAndRemove({deviceID:deviceID},callback)
};

