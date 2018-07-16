const mongoose = require('mongoose');
const apn = require('apn');
const db = require('../functions/postgredb');
const logger = require('../functions/logger');

mongoose.connect('mongodb://localhost/APITest');


const optionsToFile = {
    token: {
        key: "../cert.p8",
        keyId: "PFYGPR25U8",
        teamId: "4SMWL7L89M"
    },
    production: false
};

function sendIos(deviceId, message, badgeNumber) {
    let apnprovider = new apn.Provider(optionsToFile);
    let deviceToken = deviceId;
    let notification = new apn.Notification();
    notification.badge = badgeNumber;
    notification.alert = message;
    notification.topic = "com.blockchainglobal.bglmedia";
    console.log(notification);
    apnprovider.send(notification, deviceToken).then(result => {
            console.log(result);
            result.failed.forEach(failure => {
                if (failure.status === '410' || failure.status ==='400') {
                    db.deleteIOSDevice(deviceId,(err,res)=>{
                        if(err){
                            console.log(err);
                            logger.databaseError("notification","server",err)

                        } else{
                            console.log(deviceToken+" has been deleted from db due to invalid device token")
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
    db.getAllIOSDeviceForFlashNotification((err, list) =>{
        if(err){
            console.log(err);
            logger.databaseError("notification","server",err)
        } else{
            if(list.rows[0] === null || list.rows[0]===undefined){
                console.log("No device in device database");
                logger.databaseError("notification","db","No device in device database")
            } else {
                list.rows.forEach(row=>{
                    db.addIOSDeviceNumber(row.device_token,(err, msg)=>{
                        sendIos(row.device_token,message,msg.rows[0].number)
                    })
                    
                })
            }
        }

    })
};


module.exports.sendAlert = (deviceId, message,badgeNumber) => {
    sendIos(deviceId, message,badgeNumber)
};