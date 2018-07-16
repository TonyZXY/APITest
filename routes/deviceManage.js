const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const logger = require('../functions/logger')

const options = {
    user: 'bglappdev100',
    pass: "appdevgkV6="
};

mongoose.connect('mongodb://localhost/APITest');

module.exports = router;

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
                db.getUser(email, (err, msg) => {
                    if (err) {
                        console.log(err);
                        let address = req.connect.remoteAddress
                        logger.databaseError("deviceManage",address, err);
                        return res.send({
                            success: false,
                            message: 'Token error',
                            code: 410,
                            token: null
                        })
                    } else {
                        let user = msg.rows[0];
                        if (msg.rows[0] === undefined) {
                            let address = req.connect.remoteAddress
                            logger.databaseError("deviceManage",address, "No user in database");
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
            let address = req.connection.remoteAddress;
            logger.databaseError('deviceManage',address, err);
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
            let address = req.connection.remoteAddress;
            logger.databaseError('deviceManage',address, err);
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


router.post('/changeNotification', verifyToken, (req, res) => {
    let userEmail = req.body.email;
    let flash = req.body.flash;
    let interest = req.body.interest;
    db.updateNotificationStatus(userEmail, flash, interest, (err, msg) => {
        if (err) {
            databaseError(err, res);
            let address = req.connection.remoteAddress;
            logger.databaseError('deviceManage',address, err);
        } else {
            res.send({
                success: true,
                message: 'Successfully Update notification status',
                code: 200,
                data: msg.rows[0]
            })
        }
    })
});

router.post('/logoutIOSDevice',verifyToken,(req,res)=>{
    let deviceToken = req.body.deviceToken;
    db.deleteIOSDevice(deviceToken,(err,msg)=>{
        if (err) {
            databaseError(err,res);
            let address = req.connection.remoteAddress;
            logger.databaseError('deviceManage',address, err);
        } else {
            res.send({
                success:true,
                message: 'Successfully Update notification status',
                code: 200,
                data: msg.rows[0]
            })
        }
    })
});

// router.post('/changeFlashNotificationStatus', verifyToken,(req,res)=>{
//     let userEmail = req.body.email;
//     let status = req.body.status;
//     db.updateFlashNotificationStatus(userEmail,status,(err,msg)=>{
//         if (err) {
//             databaseError(err,res);
//             let address = req.connection.remoteAddress;
//             logger.databaseError('deviceManage',address, err);
//         } else {
//             res.send({
//                 success: true,
//                 message: "Successfully Update Flash News Notification status",
//                 code: 200,
//                 data: msg.rows[0]
//             })
//         }
//     })
// });

