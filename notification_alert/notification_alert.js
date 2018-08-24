const mongoose = require('mongoose');
const apn = require('apn');
const db = require('../functions/postgredb');
const logger = require('../functions/logger');

const config = require('../config');

mongoose.connect(config.database, config.options);


const optionsToFile = {
    token: {
        key: "../cert.p8",
        keyId: "PFYGPR25U8",
        teamId: "4SMWL7L89M"
    },
    production: true
};

function sendIos(deviceId, message, badgeNumber) {
    let apnprovider = new apn.Provider(optionsToFile);
    let deviceToken = deviceId;
    let notification = new apn.Notification();
    notification.badge = badgeNumber;
    notification.alert.title = "Alert!";
    notification.alert.body = message;
    notification.sound = 'default';
    notification.topic = "com.blockchainglobal.bglmedia";
    apnprovider.send(notification, deviceToken).then(result => {
        console.log(result);
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


module.exports.sendFlashNotification = (title, message) => {
    db.getAllIOSDeviceForFlashNotification((err, list) => {
        if (err) {
            console.log(err);
            logger.databaseError("notification", "server", err)
        } else {
            if (list.rows[0] === null || list.rows[0] === undefined) {
                console.log("No device in device database");
                logger.databaseError("notification", "db", "No device in device database")
            } else {
                list.rows.forEach(row => {
                    db.addIOSDeviceNumber(row.device_token, (err, msg) => {
                        sendIos(row.device_token,title,message,msg.rows[0].number)
                    })

                })
            }
        }

    })
};


module.exports.sendAlert = (deviceId, message, badgeNumber) => {
    sendIos(deviceId, message, badgeNumber)
};