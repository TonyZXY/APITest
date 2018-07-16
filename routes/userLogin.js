const express = require('express');
const router = express.Router();
const hashPassword = require('password-hash');
const jwt = require('jsonwebtoken');
const db = require('../functions/postgredb');
const logger = require('../functions/logger')


const agl = 'sha256';
const inter = 20;


router.post('/register', (req, res) => {
    let email = req.body.email;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let title = req.body.title;
    let password = req.body.password;
    if (firstName === null || firstName === undefined ||
        lastName === null || lastName === undefined ||
        email === null || email === undefined ||
        password === null || password === undefined ||
        email === null || email === undefined) {
        res.send({
            success: false,
            message: 'Bad Request',
            code: 400,
            token: null
        });
    } else {
        let passwordHash = hashPassword.generate(password, {
            algorithm: agl,
            saltLength: 15,
            iterations: inter
        });
        let st = passwordHash.split('$');
        let passwordToDB = st[3];
        let salt = st[1];
        db.registerUser(firstName, lastName, email, passwordToDB, title, 'EN', salt, (err, msg) => {
            if (err) {
                res.send({
                    success: false,
                    message: 'Register fail',
                    code: 409,
                    token: null
                })
                logger.databaseError("userLogin",req.connection.remoteAddress, err);
            } else {
                let user = msg.rows[0];
                let payload = {
                    userID: user.user_id,
                    password: user.password
                };
                let tokenToSend = jwt.sign(payload, user.email);
                res.send({
                    success: true,
                    message: 'Register success',
                    code: 200,
                    token: tokenToSend
                })
            }
        });
    }
});

router.post('/login', (req, res) => {
    let userName = req.body.email;
    let password = req.body.password;
    if (userName === null || userName === undefined ||
        password === null || password === undefined) {
        res.send({
            success: false,
            message: "Login Fail",
            code: 406,
            token: null
        })
    } else {
        db.getUser(userName, (err, msg) => {
            if (err) {
                console.log(err);
                let address = req.connection.remoteAddress;
                logger.databaseError('userLogin',address, err);
                res.send({
                    success: false,
                    message: 'login error',
                    code: 406,
                    token: null,
                })
                logger.databaseError("userLogin",req.connection.remoteAddress,err);
            } else {
                if (msg.rows[0] === undefined) {
                    console.log('no user found');
                    let address = req.connection.remoteAddress;
                    logger.databaseError('userLogin',address, 'No user is found');
                    res.send({
                        success: false,
                        message: 'Email or Password Error',
                        code: 404,
                        token: null
                    })
                } else {
                    let user = msg.rows[0];
                    let passwordToVerify = agl + '$' + user.salt + '$' + inter + '$' + user.password;
                    if (!hashPassword.verify(password, passwordToVerify)) {
                        res.send({
                            success: false,
                            message: 'Email or Password Error',
                            code: 404,
                            token: null
                        })
                    } else {
                        let payload = {
                            userID: user._id,
                            password: user.password
                        };
                        let tokenToSend = jwt.sign(payload, user.email);
                        res.send({
                            success: true,
                            message: 'Login Success',
                            code: 200,
                            token: tokenToSend
                        })
                    }
                }
            }
        })
    }
});


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
                        let address = req.connection.remoteAddress;
                        logger.databaseError('userLogin',address, err);
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


router.post('/addInterest', verifyToken, (req, res) => {
    let userEmail = req.body.email;
    let interest = req.body.interest;
    db.getTradingPair(interest.from, interest.to, interest.market, (err, msg) => {
        if (err) {
            databaseError(err, res);
            let address = req.connection.remoteAddress;
            logger.databaseError('userLogin',address, err);
        } else {
            if (msg.rows[0] === null || msg.rows[0] === undefined) {
                db.addTradingPair(interest.from, interest.to, interest.market, (err, msg) => {
                    if (err) {
                        databaseError(err, res);
                        let address = req.connection.remoteAddress;
                        logger.databaseError('userLogin',address, err);
                    } else {
                        let coinID = msg.rows[0]._id;
                        db.addInterestWithOutTradingPair(userEmail, coinID, interest.price, interest.isGreater, (err, msg) => {
                            if (err) {
                                databaseError(err, res);
                                let address = req.connection.remoteAddress;
                                logger.databaseError('userLogin',address, err);
                            } else {
                                let coin = msg.rows[0];
                                res.send({
                                    success: true,
                                    message: "Interest Add to database",
                                    code: 200,
                                    data: coin
                                })
                            }
                        })
                    }
                })
            } else {
                let coinID = msg.rows[0]._id;
                db.addInterestWithTradingPair(userEmail, coinID, interest.price, interest.isGreater, (err, msg) => {
                    if (err) {
                        databaseError(err, res);
                        let address = req.connection.remoteAddress;
                        logger.databaseError('userLogin',address, err);
                    } else {
                        let coin = msg.rows[0];
                        res.send({
                            success: true,
                            message: "Interest Add to database",
                            code: 200,
                            data: coin
                        })
                    }
                })
            }
        }
    })
});


router.post('/editInterestStatus', verifyToken, (req, res) => {
    let userEmail = req.body.email;
    let interests = req.body.interest;
    db.changeInterestStatus(interests, (err, msg) => {
        if (err) {
            databaseError(err, res);
            let address = req.connection.remoteAddress;
            logger.databaseError('userLogin',address, err);
        } else {
            let interests = msg.rows;
            res.send({
                success: true,
                message: 'Success update Interest ststus',
                code: 200,
                data: interests
            })
        }
    });
});




router.post('/editInterest', verifyToken, (req, res) => {
    let userEmail = req.body.email;
    let interest = req.body.interest;
    db.getInterest(interest.id, (err, msg) => {
        if (err) {
            databaseError(err, res);
            let address = req.connection.remoteAddress;
            logger.databaseError('userLogin',address, err);
        } else {
            let interestFromDB = msg.rows[0];
            if (interestFromDB.from === interest.from &&
                interestFromDB.to === interest.to &&
                interestFromDB.market === interest.market) {
                // TODO update frequency
                db.updateInterestPrice(interest.id, interest.price, interest.isGreater, (err, msg) => {
                    if (err) {
                        databaseError(err, res);
                        let address = req.connection.remoteAddress;
                        logger.databaseError('userLogin',address, err);
                    } else {
                        res.send({
                            success: true,
                            message: "Successfully Update interest",
                            code: 200,
                            data: msg.rows[0]
                        })
                    }
                })
            } else {
                // TODO update frequency
                db.getTradingPair(interest.from, interest.to, interest.market, (err, msg) => {
                    if (err) {
                        databaseError(err, res);
                        let address = req.connection.remoteAddress;
                        logger.databaseError('userLogin',address, err);
                    } else {
                        if (msg.rows[0] === null || msg.rows[0] === undefined) {
                            db.addTradingPair(interest.from, interest.to, interest.market, (err, msg) => {
                                if (err) {
                                    databaseError(err, res);
                                    let address = req.connection.remoteAddress;
                                    logger.databaseError('userLogin',address, err);
                                } else {
                                    let coinID = msg.rows[0]._id;
                                    db.updateInterestCoin(interest.id, coinID, interest.price, interest.isGreater, (err, msg) => {
                                        if (err) {
                                            databaseError(err, res);
                                            let address = req.connection.remoteAddress;
                                            logger.databaseError('userLogin',address, err);
                                        } else {
                                            res.send({
                                                success: true,
                                                message: "Successfully update interest",
                                                code: 200,
                                                data: msg.rows[0]
                                            })
                                        }
                                    })
                                }
                            })
                        } else {
                            let coinID = msg.rows[0]._id;
                            db.updateInterestCoin(interest.id, coinID, interest.price, interest.isGreater, (err, msg) => {
                                if (err) {
                                    databaseError(err, res);
                                    let address = req.connection.remoteAddress;
                                    logger.databaseError('userLogin',address, err);
                                } else {
                                    res.send({
                                        success: true,
                                        message: "Successfully update interest",
                                        code: 200,
                                        data: msg.rows[0]
                                    })
                                }
                            })
                        }
                    }
                })
            }
        }
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


router.post('/deleteInterest', verifyToken, (req, res) => {
    let interests = req.body.interest;
    db.deleteInterest(interests, (err, msg) => {
        if (err) {
            databaseError(err, res);
            let address = req.connection.remoteAddress;
            logger.databaseError('userLogin',address, err);
        } else {
            res.send({
                success: true,
                message: "Successfully delete Interest",
                code: 200,
                data: msg.rows
            })
        }
    });
});


router.post('/getInterest', verifyToken, (req, res) => {
    let userEmail = req.body.email;
    db.getInterests(userEmail, (err, msg) => {
        if (err) {
            databaseError(err, res);
            let address = req.connection.remoteAddress;
            logger.databaseError('userLogin',address, err);
        } else {
            if (msg.rows[0] === undefined) {
                res.send({
                    success: false,
                    message: "interest not found",
                    code: 404,
                    data: null
                })
            } else {
                res.send({
                    success: true,
                    message: "Interest In Database",
                    code: 200,
                    data: msg.rows
                });
            }
        }
    })
});


router.post('/getNotificationStatus', verifyToken, (req, res) => {
    let userEmail = req.body.email;
    db.getInterestStatus(userEmail, (err, msg) => {
        if (err) {
            databaseError(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('userLogin',address, err);
        } else {
            res.send({
                success: true,
                message: "Interest Status found",
                code: 200,
                data: msg.rows[0]
            })
        }
    })
});










module.exports = router;

