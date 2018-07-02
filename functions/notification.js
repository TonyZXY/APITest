const mongoose = require('mongoose');
const IOSDevice = require('../module/IOSDevice');
const apn = require('apn');
const NotificationIOS = require('../module/CoinNotificationIOS')

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
            console.log(result.failed)
            result.failed.forEach(failure => {
                if (failure.status === '410') {
                    IOSDevice.deleteDeviceByToken(deviceToken,(err,res) => {
                        if(err){
                            console.log(err);
                        } else{
                            console.log(deviceToken+" has been deleted from db due to invalid device token")
                        }
                    })
                    NotificationIOS.deleteDeviceByToken(deviceToken,(err,res) => {
                        if(err){
                            console.log(err);
                        } else{
                            console.log("Remove invalid device token procedure")
                        }
                    })
                } else {
                    console.log("not this one")
                }
            })
    })

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

module.exports.sendAlertNotification = (userid, message) => {
    NotificationIOS.getNotificationIOSDeviceByUserID(userid, function (err, deviceList) {
        if(err){
            console.log(err);
        } else if(!deviceList){
            console.log("Currently no user is added in the database")
        }else{
            deviceList.deviceID.forEach(device =>{
                sendIos(device, message)
            })
        }
    })
};
