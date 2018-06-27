const mongoose = require('mongoose');
const IOSDevice = require('../module/IOSDevice');
const apn = require('apn');


mongoose.connect('mongodb://localhost/APITest');


const optionsToFile = {
    token: {
        key: "cert.p8",
        keyId: "FWQ4PAZLMF",
        teamId: "64QSYLCXQ8"
    },
    production: false
};

function sendIos(deviceId, message) {
    let apnprovider = new apn.Provider(optionsToFile);
    let deviceToken = deviceId;
    let notification = new apn.Notification();
    notification.alert = message;
    notification.topic = "BlockChainGlobal.BGLMedia";
    apnprovider.send(notification, deviceToken).then(result => {
        console.log(result);
    });
    apnprovider.shutdown();
}


module.exports.sendFlashNotification = (message) => {
    IOSDevice.getDeviceList((err, devices) => {
        if (err) {
            console.log(err);
        } else {
            devices.forEach(device => {
                sendIos(device.deviceID, message);
            })
        }
    })
};

module.exports.sendCoinNotification = (userID, message) => {
    IOSDevice.getDevice(userID, (err, devices) => {
        if (err) {
            console.log(err);
        } else {
            devices.forEach(device => {
                sendIos(device.deviceID, message);
            })
        }
    })
};