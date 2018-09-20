const mongoose = require('mongoose');
const apn = require('apn');
const db = require('../functions/postgredb');
const logger = require('../functions/logger');

const config = require('../config');

mongoose.connect(config.database, config.options);


const optionsToFile = {
    token: {
        key: "cert.p8",
        keyId: "PFYGPR25U8",
        teamId: "4SMWL7L89M"
    },
    production: true
};

function sendIos(deviceId, title, message, badgeNumber) {
    let apnprovider = new apn.Provider(optionsToFile);
    let deviceToken = deviceId;
    let notification = new apn.Notification();
    notification.badge = badgeNumber;
    notification.title = title;
    notification.body = message;
    notification.topic = "com.blockchainglobal.bglmedia";
    notification.sound = 'default';
    apnprovider.send(notification, deviceToken).then(result => {
        result.failed.forEach(failure => {
            if (failure.status === '410') {
                db.deleteIOSDevice(deviceId, (err, res) => {
                    if (err) {
                        console.log(err);
                        logger.databaseError("notification", "server", err)

                    } else {
                        console.log(deviceToken + " has been deleted from db due to invalid device token")
                    }
                })
            } else {
                console.log("not this one")
            }
        })
    });


    apnprovider.shutdown();
}


module.exports.sendFlashNotification = (title,message)=>{
    db.getIOSNewsFlash((err,dbmsg1)=>{
        if (err){
            console.log(err);
            logger.databaseError("notification","server",err);
        } else {
            if(dbmsg1.rows[0] === null || dbmsg1.rows[0]===undefined){
                db.getAllIOSDeviceForFlashNotification((err,dbmsg3)=>{
                    let list = dbmsg3.rows;
                    list.forEach( element =>{
                        db.addIOSDeviceNumber(element.device_token,(err,msg3)=>{
                            sendIos(element.device_token,title,message,msg3.rows[0].number)
                        })
                    })
                });
            } else {
                let list1 = dbmsg1.rows;
                db.getAllIOSDeviceForFlashNotification((err,dbmsg2)=>{
                    if(err){
                        console.log(err);
                        logger.databaseError("notification","server",err)
                    } else {
                        if(dbmsg2.rows[0] === null || dbmsg2.rows[0]===undefined){
                            console.log("No device in device database");
                            logger.databaseError("notification","db","No device in device database")
                        } else {
                            let list2 = dbmsg2.rows;
                            list2.forEach( device =>{
                                db.addIOSDeviceNumber(device.device_token,(err,msg1)=>{
                                    sendIos(device.device_token,title,message,msg1.rows[0].number)
                                });
                                list1 = list1.filter( e =>
                                    e.device_token !== device.device_token
                                );
                            });
                            list1.forEach( element =>{
                                db.addIOSNewsFlashNumber(element.device_token,(err,msg2)=>{
                                    sendIos(element.device_token,title,message,msg2.rows[0].number)
                                });
                            })
                        }
                    }
                })
            }
        }
    })
};

module.exports.sendAlert = (deviceId,title ,message,badgeNumber) => {
    sendIos(deviceId,"Alert!",message,badgeNumber)
};