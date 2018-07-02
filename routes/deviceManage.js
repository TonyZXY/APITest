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
const Customer = require('../module/Customer')

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

// FIXME: May need change or test currently
router.post('/addAlertDevice', function(req,res){
    const deviceToken = req.body.token;
    const email = req.body.userEmail;
    const user = new NotificationIOS();
    user.deviceID[0] = deviceToken;
    Customer.getUser(email,function(err, customer){
       if(err){
           console.log(err)
       } else if(!customer){
            res.send({"err": "No such user."});
       } else{
            user.userID = customer._id;
            NotificationIOS.findUser(user, function(err, userInDB){
                if(err){
                    console.log(err);
                } else if(!userInDB){
                    NotificationIOS.addNotificationIOSUser(user, function(err, user){
                        if(err){
                            console.log(err);
                        } else {
                            res.send({"message": "Succeeded on adding user"});
                        }
                    })
                } else{
                    let checkSame = false;
                    userInDB.deviceID.forEach(device => {
                        if(device === deviceToken){
                            checkSame = true;
                        }
                    });
        
                    if(!checkSame){ 
                        NotificationIOS.addDeviceTokenToUser(userInDB, deviceToken, function(err, user){
                            if(err){
                                console.log(err)
                            } else{
                                res.send({"message": "Succeeded on adding token"});
                            }
                        })
                    } else {
                        res.send({"message": "Second attempt on same device of same user"})
                    }
                }
            })
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

router.get('/NotificationDevice', function(req, res){
    NotificationIOS.getNotificationIOSDevice(function (err, deviceList) {
        if (err) {
            console.log(err);
        }
        res.json(deviceList);
    })
})
