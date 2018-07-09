const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Customer = require('../module/Customer');
const hashPassword = require('password-hash');
const jwt = require('jsonwebtoken');
const Interest = require('../module/CoinInterest');
const db = require('../functions/postgredb');

mongoose.connect('mongodb://localhost/APITest');

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
        console.log(passwordHash);
        let st = passwordHash.split('$');
        let passwordToDB = st[3];
        let salt = st[1];
        console.log('password: ' + passwordToDB + " salt: " + salt);
        db.registerUser([firstName, lastName, email, passwordToDB, title, 'EN', salt], (err, msg) => {
            if (err) {
                res.send({
                    success: false,
                    message: 'Register fail',
                    code: 409,
                    token: null
                })
            } else {
                let user = msg.rows[0];
                let payload = {
                    userID: user.user_id,
                    password: user.password
                };
                let tokenToSend = jwt.sign(payload, user.email);
                console.log(tokenToSend);
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
        db.getUser([userName], (err, msg) => {
            if (err) {
                console.log(err);
                res.send({
                    success: false,
                    message: 'login error',
                    code: 406,
                    token: null,
                })
            } else {
                if (msg.rows[0] === undefined) {
                    console.log('no user found');
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
                            userID: user.user_id,
                            password: user.password
                        };
                        let tokenToSend = jwt.sign(payload, user.email);
                        console.log(tokenToSend);
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


router.post('/addInterest', verifyToken, (req, res) => {
    let userEmail = req.body.email;
    let interests = req.body.interest;
    Customer.getUser(userEmail, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            let userID = user._id;
            let length = interests.length;
            let times = 0;
            interests.forEach(interest => {
                if (interest._id === null || interest._id === undefined) {
                    db.getTradingPair([interest.from,interest.to,interest.market],(err,msg)=>{
                        if (err) {
                            console.log(err);
                            res.send({
                                success:false,
                                message:'Database Error',
                                code: 510,

                            })
                        }
                    });
                    Interest.AddInterest(userID, interest, (err, intFromDB) => {
                        if (err) {
                            console.log(err);
                        } else {
                            times += 1;
                            if (length === times) {
                                Interest.getInterest(userID, (err, message) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.json(message);
                                    }
                                })
                            }
                        }
                    })
                } else {
                    Interest.updateInterest(userID, interest, (err, intFromDB) => {
                        if (err) {
                            console.log(err);
                        } else {
                            times += 1;
                            if (length === times) {
                                Interest.getInterest(userID, (err, message) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.json(message);
                                    }
                                })
                            }
                        }
                    })
                }
            });
        }
    });
});

router.post('/changeNotificationStatus', verifyToken, (req, res) => {
    let userEmail = req.body.email;
    let userStatus = req.body.userStatus;
    Customer.getUser(userEmail, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            let userID = user._id;
            Interest.closeNotificationStatus(userID, userStatus, (err, interests) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json(interests);
                }
            })
        }
    })
});

router.post('/deleteInterest', verifyToken, (req, res) => {
    let userEmail = req.body.email;
    let interestIDs = req.body.interests;
    Customer.getUser(userEmail, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            let userID = user._id;
            let length = interestIDs.length;
            let times = 0;
            interestIDs.forEach(interest => {
                Interest.deleteInterest(userID, interest._id, (err, msg) => {
                    if (err) {
                        console.log(err);
                    } else {
                        times += 1;
                        if (times === length) {
                            Interest.getInterest(userID, (err, msg) => {
                                res.json(msg);
                            })
                        }
                    }
                });

            });
        }
    })
});

router.get('/interestOfUser/:_id', (req, res) => {
    let userEmail = req.params._id;
    Customer.getUser(userEmail, (err, customer) => {
        if (!customer) {
            res.send({
                "error": "No certain user"
            })
        } else {
            let userId = customer._id;
            Interest.getInterest(userId, (err, msg) => {
                if (!msg) {
                    res.send({
                        error: "No interest found"
                    })
                } else {
                    if (err) {
                        console.log(err);
                    } else {
                        res.json(msg);
                    }
                }
            })
        }
    })
});


module.exports = router;

