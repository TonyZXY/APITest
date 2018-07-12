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
const NotificationIOS = require('../module/CoinNotificationIOS');
const Customer = require('../module/Customer');
const db = require('../functions/postgredb');

function verifyToken(req, res, next) {
    let token = req.body.token;
    let email = req.body.email;
    if (token === null || token === undefined ||
        email === null || email === undefined) {
        return res.send({
            success: false,
            message: "Token Error",
            code: 403,
            token: null
        })
    } else {
        console.log("token for verify is " + token);
        let payload = jwt.verify(token.toString(), email.toString());
        if (!payload) {
            return res.send({
                success: false,
                message: "Token Error",
                code: 403,
                token: null
            })
        } else {
            let userID = payload.userID;
            let password = payload.password;
            if (userID === null || password === null ||
                userID === undefined || password === undefined) {
                return res.send({
                    success: false,
                    message: "Token Error",
                    code: 403,
                    token: null
                })
            } else {
                db.getUser([email], (err, msg) => {
                    if (err) {
                        console.log(err);
                        return res.send({
                            success: false,
                            message: 'Token error',
                            code: 410,
                            token: null
                        })
                    } else {
                        let user = msg.rows[0];
                        if (msg.rows[0] === undefined) {
                            return res.send({
                                success: false,
                                message: 'Token Error',
                                code: 403,
                                token: null
                            })
                        } else {
                            if (user.password.toString() !== password.toString() ||
                                (user._id).toString() !== userID.toString()) {
                                return res.send({
                                    success: false,
                                    message: "Token Error",
                                    code: 403,
                                    token: false
                                });
                            } else {
                                next()
                            }
                        }
                    }
                });
            }
        }
    }
}

router.post('/addIOSDevice', function (req, res) {
    const device = req.body;
    IOSDevice.getDevice(device.deviceID, (err, deviceInServer) => {
        if (err) {
            console.log(err);
        } else {
            if (deviceInServer) {
                if (device.notification !== deviceInServer.notification) {
                    //update notification status
                    IOSDevice.updateNotificationStatus(device.deviceID, function (req, response) {
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
                            res.send({"message": "Succeeded on update user"});
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

});

router.get('/IOSDevice', function(req, res){
    IOSDevice.getDeviceList(function (err, deviceList) {
        if (err) {
            console.log(err);
        }
        res.json(deviceList);
    })
});

router.delete('/IOSDevice/:_id',function(req,res){
    const id = req.params._id;
    IOSDevice.deleteDevice(id, function (err, device) {
        if (err) {
            console.log(err);
        }
        res.json(device);
    })
});

router.get('/DeviceToken/:_id',function(req,res){
    const deviceToken = req.params._id;
    IOSDevice.getDeviceByToken(deviceToken, function (err, device) {
        if (err) {
            console.log(err);
        }
        res.json(device);
    })
});

router.get('/NotificationDevice', function(req, res){
    NotificationIOS.getNotificationIOSDevice(function (err, deviceList) {
        if (err) {
            console.log(err);
        }
        res.json(deviceList);
    })
});



function databaseError(err, res) {
    console.log(err);
    res.send({
        success: false,
        message: 'Database Error',
        code: 510
    })
}

router.post('/addIOSDevice',verifyToken,(req,res)=>{
    let userEmail = req.body.email;
    let deviceToken = req.body.deviceToken;
    db.addIOSDevice(userEmail,deviceToken,(err,msg)=>{
        if (err){
            databaseError(err,res);
        } else {
            res.send({
                success: true,
                message: "Successfully add IOS device",
                code:200,
                data: msg.rows[0]
            })
        }
    })
});


router.post('/receivedNotification',verifyToken,(req,res)=>{
    let token = req.body.deviceToken;
    db.setIOSDeviceNumberToZero(token,(err,msg)=>{
        if (err) {
            databaseError(err,res);
        } else {
            res.send({
                success: true,
                message: "Change Notification to Zero",
                code: 200,
                data: msg.rows[0]
            })
        }
    })
});

