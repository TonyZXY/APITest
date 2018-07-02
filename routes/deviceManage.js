const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const options = {
    user: 'bglappdev100',
    pass: "appdevgkV6="
};

mongoose.connect('mongodb://localhost/APITest');

module.exports = router;

const IOSDevice = require('../module/IOSDevice');
const NotificationIOS = require('../module/CoinNotificationIOS')

router.post('/addIOSDevice', function (req, res) {
    const device = req.body;
    IOSDevice.getDevice(device.deviceID, (err, deviceInServer) => {
        if (err) {
            console.log(err);
        } else {
            if (deviceInServer) {
                if (device.notification !== deviceInServer.notification) {
                    //update notification status
                    IOSDevice.updateNotificationStatus(device.deviceID, function (req, res) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send({ n: "update successfully" })
                        }
                    })
                } else {
                    res.send({
                        n: "error"
                    });
                }

            } else {
                IOSDevice.addDevice(device, (err, deviceAdded) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.json(deviceAdded);
                    }
                })
            }
        }
    })
});

// FIXME: No testing right now, fix it
router.post('/addAlertDevice', function(req,res){
    const deviceToken = req.body.deviceToken;
    const user = new NotificationIOS();
    user.userID = req.body.userID;
    user.device.deviceToken[0] = deviceToken;
    NotificationIOS.addNotificationIOSUser(user, deviceToke, function(err, userInDB){
        if(err){
            console.log(err);
        } else{
            res.json(userInDB);
        }
    })
})








router.get('/IOSDevice', function(req, res){
    IOSDevice.getDeviceList(function (err, deviceList) {
        if (err) {
            console.log(err);
        }
        res.json(deviceList);
    })
})

router.delete('/IOSDevice/:_id',function(req,res){
    const id = req.params._id;
    IOSDevice.deleteDevice(id, function (err, device) {
        if (err) {
            console.log(err);
        }
        res.json(device);
    })
})
