const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../functions/postgredb');
const logger = require('../functions/logger');
const mongoose = require('mongoose');
const Notification = require('../functions/notification');
const Ranking = require('./Ranking');
const GameCoin = require('./GameCoin');


const config = require('../config');

mongoose.connect(config.database,config.options);

const path = require('path');


function verifyToken(req, res, next) {
    try {
        let token = req.body.token;
        let email = req.body.email;
        let address = req.connection.remoteAddress;
        if (token === null || token === undefined ||
            email === null || email === undefined) {
            logger.userRegistrationLoginLog(address, "Invalid param number");
            return res.send({
                success: false,
                message: "Token Error",
                code: 403,
                token: null
            })

        } else {
            let payload = jwt.verify(token.toString(), email.toString());
            if (!payload) {
                logger.userRegistrationLoginLog(address, "No payload");
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
                    logger.userRegistrationLoginLog(address, "Empty userID or Password in Email is:" + email);
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
                            let address = req.connection.remoteAddress;
                            logger.databaseError('userLogin', address, err);
                            return res.send({
                                success: false,
                                message: 'Token error',
                                code: 410,
                                token: null
                            })
                        } else {
                            let user = msg.rows[0];
                            if (msg.rows[0] === undefined) {
                                logger.userRegistrationLoginLog(address, "User Not found in Email: " + email);
                                return res.send({
                                    success: false,
                                    message: 'Token Error',
                                    code: 403,
                                    token: null
                                })
                            } else {
                                if (user.password.toString() !== password.toString() ||
                                    (user._id).toString() !== userID.toString()) {
                                    logger.userRegistrationLoginLog(address, "Compare password or userid failed in Email: " + email);
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
    } catch (err) {
        console.log(err);
        // TODO: Add err logger here
        res.send(err);
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


function badRequest(res) {
    console.log("bad request");
    res.send({
        success: false,
        message: "bad request",
        code: 500,
        data: null
    })
}


router.post('/register', verifyToken, (req, res) => {
    let email = req.body.email;
    let nickname = req.body.nickname;
    if (nickname === null || nickname=== undefined){
        badRequest(res);
    } else {
        db.gameSetNickName(email, nickname, (err, dbmsg) => {
            if (err) {
                if (err.code === '23505') {
                    res.send({
                        success: false,
                        message: "Nickname already taken by other user, choose another nickname",
                        code: 789,
                        data: null
                    });
                } else {
                    databaseError(err, res);
                }
            } else {
                let user_id = dbmsg.rows[0].user_id;
                db.gameSetUpAccount(user_id, (err2, dbmsg2) => {
                    if (err2) {
                        if (err2.code === '23505') {
                            res.send({
                                success: false,
                                message: "User already register, please contact tech support",
                                code: 750,
                                data: null
                            })
                        } else {
                            databaseError(err2, res);
                        }
                    } else {
                        let data = dbmsg2.rows[0];
                        data.nick_name = nickname;
                        res.send({
                            success: true,
                            message: "Successfully register trading game",
                            code: 200,
                            data: data
                        })
                    }
                })
            }
        })
    }
});



router.post('/addTransaction', verifyToken, (req, res) => {
    let user_id = req.body.user_id;
    let transaction = req.body.transaction;
    if (user_id === null || user_id === undefined || transaction === null || transaction === undefined) {
        res.send({
            message: 'Bad request',
            code: 500,
            success: false,
            data: null
        });
    } else {
        db.gameUpdateAccountAmount(user_id, transaction.status, transaction.amount, transaction.coinAddName, transaction.singlePrice * transaction.amount, (err, dbmsg1) => {
            if (err) {
                if (err.code === '23514') {
                    res.send({
                        message: 'Amount doesn\'t enough!',
                        code: 440,
                        success: false,
                        data: null
                    })
                } else {
                    databaseError(err, res);
                }
            } else {
                transaction.transaction_fee = transaction.amount * transaction.singlePrice * 0.01;
                db.gameAddTransactionList(user_id, transaction, (err, dbmsg2) => {
                    if (err) {
                        databaseError(err, res);
                    } else {
                        res.send({
                            message: 'Successfully add new transaction',
                            code: 200,
                            success: true,
                            data: {
                                transaction: dbmsg2.rows[0],
                                account: dbmsg1.rows[0]
                            }
                        })
                    }
                })
            }
        });
    }
});


router.post('/addAlert', verifyToken, (req, res) => {
    let user_id = req.body.user_id;
    let alert = req.body.alert;
    if (user_id === null || user_id === undefined ||
        alert === null || alert === undefined){
        badRequest(res);
    } else {
        db.gameSetAlert(user_id,alert,(err,msg)=>{
            if (err) {
                databaseError(err,res);
            } else {
                res.send({
                    message: 'Successfully add price alert',
                    code: 200,
                    success: true,
                    data: msg.rows
                })
            }
        })
    }
});


router.post('/editAlert', verifyToken, (req, res) => {
    let user_id = req.body.user_id;
    let alert = req.body.alert;
    if (user_id === null || user_id === undefined||
        alert === null || alert === undefined){
        badRequest(res);
    } else {
        db.gameUpdateAlert(alert,(err,dbmsg)=>{
            if (err){
                databaseError(err,res);
            } else {
                res.send({
                    message: 'successfully update Alert',
                    code: 200,
                    success: true,
                    data: dbmsg.rows
                })
            }
        })
    }
});


router.post('/getAlertList',verifyToken,(req,res)=>{
    let user_id = req.body.user_id;
    if (user_id === null || user_id === undefined){
        badRequest(res);
    } else {
        db.gameGetAlert(user_id,(err,msg)=>{
            if (err){
                databaseError(err,res);
            } else {
                res.send({
                    message: "successfully get alert data",
                    code: 200,
                    success: true,
                    data: msg.rows
                })
            }
        })
    }
});


router.post('/changeAlertNotifications', verifyToken, (req, res) => {
    let user_id = req.body.user_id;
    let alerts = req.body.alerts;
    if (user_id === null || user_id === undefined||
        alerts === null || alerts === undefined||
        alerts[0] === null || alerts[0] === undefined){
        badRequest(res);
    } else {
        db.gameUpdateAlertStatus(alerts,(err,msg)=>{
            if (err){
                databaseError(err,res);
            } else {
                res.send({
                    message: "successfully update alert status",
                    code: 200,
                    success: true,
                    data: msg.rows
                })
            }
        })
    }
});


router.post('/getAccount', verifyToken, (req, res) => {
    let user_id = req.body.user_id;
    if (user_id === null || user_id === undefined) {
        res.send({
            message: 'bad request',
            code: 500,
            success: false,
            data: null
        })
    } else {
        db.gameGetAccountData(user_id, (err, msg) => {
            if (err) {
                databaseError(err, res);
            } else {
                res.send({
                    message: "successfully get account data",
                    code: 200,
                    success: true,
                    data: msg.rows[0]
                })
            }
        })
    }
});



router.post('/resetAccount', verifyToken, (req, res) => {
    let user_id = req.body.user_id;
    if (user_id === null || user_id === undefined) {
        badRequest(res);
    } else {
        db.gameSetAccountReset(user_id, (err, msg) => {
            if (err) {
                databaseError(err, res);
            } else {
                res.send({
                    message: 'successfully set reset account for next week',
                    code: 200,
                    success: true,
                    data: msg.rows[0]
                })
            }
        })
    }
});


router.post('/withdrawResetAccount', verifyToken, (req, res) => {
    let user_id = req.body.user_id;
    if (user_id === null || user_id === undefined) {
        badRequest(res);
    } else {
        db.gameWithdrawResetAccount(user_id, (err, msg) => {
            if (err) {
                databaseError(err, res);
            } else {
                res.send({
                    message: 'successfully cancel reset account',
                    code: 200,
                    success: true,
                    data: msg.rows[0]
                })
            }
        })
    }
});


router.post('/setStopLoss', verifyToken, (req, res) => {
    let user_id = req.body.user_id;
    let set = req.body.set;
    db.gameSelectSetLimitNumber(user_id, (err, msg1) => {
        if (err) {
            databaseError(err, res);
        } else {
            db.gameGetSetsWithCoin(user_id, set.coinName, (err, msg2) => {
                if (err) {
                    databaseError(err, res);
                } else {
                    if (msg2.rows.length < msg1.rows[0].sets) {
                        db.gameAddStopLossSet(user_id, set, (err, msg3) => {
                            if (err) {
                                databaseError(err, res);
                            } else {
                                res.send({
                                    message: 'successfully add stop loss pair',
                                    code: 200,
                                    success: true,
                                    data: msg3.rows[0]
                                })
                            }
                        })
                    } else {
                        res.send({
                            message: 'User cannot set pair due to limitation',
                            code: 450,
                            success: false,
                            data: msg2.rows
                        })
                    }
                }
            })
        }
    });
});


router.post('/editStopLoss', verifyToken, (req, res) => {
    let user_id = req.body.user_id;
    let set = req.body.set;
    if (user_id === null || user_id === undefined||
        set === null || set === undefined||
        set.set_id === null || set.set_id === undefined){
        badRequest(res);
    } else {
        db.gameEditStopLossSet(user_id,set,(err,msg)=>{
            if (err){
                databaseError(err,res);
            } else {
                res.send({
                    message:"successfully update stop loss set",
                    code:200,
                    success: true,
                    data: msg.rows
                })
            }
        })
    }
});


router.post('/getRanking',verifyToken,(req,res)=>{
    let user_id = req.body.user_id;
    if (user_id === null || user_id === undefined){
        badRequest(res);
    } else {
        Ranking.getRanking((err,msg)=>{
            if (err) {
                databaseError(err,res);
            } else {
                let rankData = msg[0];
                let ranks = rankData.data;
                let weeklyRank;
                if(ranks.length>=10){
                    weeklyRank = ranks.sort(compareWeek).slice(0,10);
                } else {
                    weeklyRank = ranks.sort(compareWeek).slice(0,ranks.length);
                }
                let totalRank;
                if(ranks.length >= 10){
                    totalRank = ranks.sort(compareTotal).slice(0,10);
                } else {
                    totalRank = ranks.sort(compareTotal).slice(0,ranks.length);
                }
                let userRank = ranks.find(e=>
                    e.user_id === user_id.toString()
                );
                if (userRank === undefined){
                    userRank = null
                }
                res.send({
                    message: 'successfully get ranking data',
                    code: 200,
                    success: true,
                    data:{
                        title:rankData.title,
                        rank_time:rankData.time,
                        rank_time_string:rankData.time_string,
                        week_number:rankData.week_number,
                        weekly_rank: weeklyRank,
                        total_rank: totalRank,
                        user_rank:userRank
                    }
                })
            }
        })
    }
});


router.post('/getStopLossList', verifyToken, (req, res) => {
    let user_id = req.body.user_id;
    if(user_id === null || user_id === undefined){
        badRequest(res);
    } else {
        db.gameGetStopLossSet(user_id,(err,msg1)=>{
            if (err){
                databaseError(err,res);
            } else {
                res.send({
                    message: 'successfully get stop loss pair',
                    code: 200,
                    success: true,
                    data: msg1.rows
                })
            }
        })
    }
});


router.post('/getAllTransactions', verifyToken, (req, res) => {
    let user_id = req.body.user_id;
    if (user_id === null || user_id === undefined){
        badRequest(res);
    } else {
        db.gameGetAllTransactionForUser(user_id,(err,msg)=>{
            if (err){
                databaseError(err,res);
            } else {
                res.send({
                    message: 'successfully get all transaction for user',
                    code: 200,
                    success: true,
                    data: msg.rows
                })
            }
        });
    }
});




router.post('/getNickName',verifyToken,(req,res)=>{
    let email = req.body.email;
    db.gameGetNickName(email,(err,msg)=>{
        if (err){
            databaseError(err,res);
        } else {
            if (msg.rows[0].nick_name === null || msg.rows[0].nick_name === undefined){
                res.send({
                    message: 'User Nickname not found, Please register',
                    code: 201,
                    success: false,
                    data: null
                })
            } else {
                res.send({
                    message: 'successfully get nick name',
                    code :200,
                    success: true,
                    data: msg.rows[0]
                })
            }
        }
    })
});


router.get('/getCoinData',(req,res)=>{
    GameCoin.getCoinList((err,msg)=>{
        if (err){
            databaseError(err,msg);
        } else {
            res.send({
                message: "successfully get coins data",
                code:200,
                success: true,
                data: msg
            })
        }
    })
});


function compareWeek(a,b) {
    if (a.week_rank < b.week_rank)
        return -1;
    if (a.week_rank > b.week_rank)
        return 1;
    return 0;
}

function compareTotal(a,b) {
    if (a.total_rank < b.total_rank)
        return -1;
    if (a.total_rank > b.total_rank)
        return 1;
    return 0;
}



module.exports = router;