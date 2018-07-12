const mongoose = require('mongoose');
const IOSDevice = require('../module/IOSDevice');
const apn = require('apn');
const NotificationIOS = require('../module/CoinNotificationIOS')
const logger = require('./logger')

mongoose.connect('mongodb://localhost/APITest');


const optionsToFile = {
    token: {
        key: "cert.p8",
        keyId: "PFYGPR25U8",
        teamId: "4SMWL7L89M"
    },
    production: false
};

function sendIos(deviceId, message) {
    let apnprovider = new apn.Provider(optionsToFile);
    let deviceToken = deviceId;
    let notification = new apn.Notification();
    notification.badge = 1;
    notification.alert = {title:"BGLMedia10101",
                            body:message};
    notification.topic = "com.blockchainglobal.bglmedia";
    apnprovider.send(notification, deviceToken).then(result => {
            console.log(result.failed)
            result.failed.forEach(failure => {
                if (failure.status === '410' || failure.status ==='400') {
                    IOSDevice.deleteDeviceByToken(deviceToken,(err,res) => {
                        if(err){
                            logger.logIntoFile('error.log','error','notification','server', err)
                        } else{
                            console.log(deviceToken+" has been deleted from db due to invalid token")
                            logger.logIntoFile('warning.log','warn','notification','server', deviceToken+" has been deleted from device_db due to invalid token")
                        }
                    });
                    NotificationIOS.deleteDeviceByToken(deviceToken,(err,res) => {
                        if(err){
                            logger.logIntoFile('error.log','error','notification','server', err)
                        } else{
                            console.log('warning.log','warn','notification','server', deviceToken+" has been deleted from user_device_db due to invalid token")
                        }
                    })
                } else {
                    console.log("not this one")
                }
            })
    });

    apnprovider.shutdown();
}


module.exports.sendFlashNotification = (message) => {
    IOSDevice.getDeviceList((err, devices) => {
        if (err) {
            console.log(err);
        } else if(!devices){
            console.log("Currently no user is added in the database")
        }else{
            devices.forEach(device => {
                if(device.notification){
                    sendIos(device.deviceID, message, 1);
                }
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
                sendIos(device, message, 1)
            })
        }
    })
};
