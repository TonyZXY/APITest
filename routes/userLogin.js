const express = require('express');
const router = express.Router();
const hashPassword = require('password-hash');
const jwt = require('jsonwebtoken');
const db = require('../functions/postgredb');
const logger = require('../functions/logger');


// FIXME: start here
const rs = require('randomstring');
// const nodemailer = require('nodemailer');
const mail = require('@sendgrid/mail');

const path = require('path');
// var transport = nodemailer.createTransport({
//     service: 'smtp.sendgrid.net',
//     port:25587,
//     auth: {
//         user: 'apikey',
//         pass: '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'
//     }
// });

mail.setApiKey('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');
//FIXME: end here


const agl = 'sha256';
const inter = 20;


router.post('/register', (req, res) => {
    let email = req.body.email;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let title = req.body.title;
    let password = req.body.password;
    let address = req.connection.remoteAddress;
    if (firstName === null || firstName === undefined ||
        lastName === null || lastName === undefined ||
        email === null || email === undefined ||
        password === null || password === undefined ||
        email === null || email === undefined) {
        res.send({
            success: false,
            message: 'Bad Request',
            code: 400,
            token: null,
        });
        logger.userRegistrationLoginLog(address, "Invalid params");
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
                    token: null,
                    err: err.code
                });
                logger.databaseError("userLogin", address, err);
                if (err.code === '23505') {
                    logger.userRegistrationLoginLog(address, "May be already registed in: " + email);
                }
            } else {
                // FIXME: Start here
                let generate = rs.generate(90);
                let key = rs.generate(40);
                let payload = {
                    token: generate
                };
                let verifyToken = jwt.sign(payload, key);
                db.addIntoVerifyTable(msg.rows[0].user_id, generate, (err, msg) => {
                    let url = "http://localhost:3020/userLogin/verify/" + verifyToken + '/' + key;
                    let mailOptions = {
                        from: 'do-not-replay@cryptogeekapp.com',
                        to: email,
                        subject: '[CryptoGeek] Please Verify Your Email',
                        html: "<body>\n" +
                            "\t<div style=\" width: 600px; margin-left: auto; margin-right: auto; text-align: center;\">\n" +
                            "\t\t<div style=\"background-color: #2d6095; padding: 25px; border-radius: 25px 25px 0px 0px;\">\n" +
                            "\t\t\t<img src=\"https://firebasestorage.googleapis.com/v0/b/email-app-6e8c9.appspot.com/o/logo.png?alt=media&token=96644680-d278-4dad-ba4f-db8745eb8e27\" alt=\"\" style=\"height: 100px;\">\n" +
                            "\t\t\t<h1 style=\"color: white;\">Email Address Verification</h1>\n" +
                            "\t\t</div>\n" +
                            "\t\t<div style=\"background-color: #ffffff; border-radius: 0px 0px 25px 25px; border: 1px solid #dddddd; padding: 25px\">\n" +
                            "\t\t\t<p>Thank you for creating a new account in <b style=\"color: #2d6095\">CRYPTOGEEK</b>.</p>\n" +
                            "\t\t\t<p>To complete your registration, we need you to verify your email address.</p>\n" +
                            "\t\t\t<a href=\""+url+"\"><button type=\"button\" style=\"width: 300px; height: 40px; font-size: 20px; font-weight: bold; color: #ffffff; background-color: #36ddab; border-radius: 10px; border: 0px; margin: 10px;\">Verify Email Address</button></a>\n" +
                            "\t\t\t<p>If you unable to click the button, please use the URL below instead.</p>\n" +
                            "\t\t\t<a href=\""+url+"\">"+url+"</a>\n" +
                            "\t\t\t<p style=\"padding-top: 30px; color: #bbbbbb\">Copyright©CRYPTOGEEK</p>\n" +
                            "\t\t</div>\n" +
                            "\t</div>\n" +
                            "</body>"
                    };
                    mail.send(mailOptions);
                    res.send({
                        message: 'Please verify your email.',
                        code: 202,
                        success: true,
                        token: null
                    })
                });
                // FIXME: end here
                // res.send({
                //     message:'Please verify your email.',
                //     user: msg.rows[0],
                //     code:200,
                //     token:null,
                //     generateedToken:generate
                // });


                // let user = msg.rows[0];
                // let payload = {
                //     userID: user.user_id,
                //     password: user.password
                // };
                // let tokenToSend = jwt.sign(payload, user.email);
                // res.send({
                //     success: true,
                //     message: 'Register success',
                //     code: 200,
                //     token: tokenToSend
                // });
                logger.userRegistrationLoginLog(address, "Registed Successfully in: " + email);
            }
        });
    }
});

router.post('/login', (req, res) => {
    let userName = req.body.email;
    let password = req.body.password;
    let address = req.connection.remoteAddress;
    if (userName === null || userName === undefined ||
        password === null || password === undefined) {
        res.send({
            success: false,
            message: "Login Fail",
            code: 406,
            token: null
        });
        logger.userRegistrationLoginLog(address, "Invalid params");
    } else {
        db.getUser(userName, (err, msg) => {
            if (err) {
                console.log(err);
                logger.databaseError('userLogin', address, err);
                res.send({
                    success: false,
                    message: 'login error',
                    code: 406,
                    token: null,
                })
            } else {
                if (msg.rows[0] === undefined) {
                    console.log('no user found');
                    logger.userRegistrationLoginLog('userLogin', address, 'No user is found');
                    res.send({
                        success: false,
                        message: 'Email or Password Error',
                        code: 404,
                        token: null
                    })
                    //FIXME: start from here
                } else {
                    let user = msg.rows[0];
                    if (user.verify === false) {
                        res.send({
                            success: false,
                            code: 202,
                            message: 'Please verify your email',
                            token: null
                        })
                        //FIXME: end here
                    } else {
                        let passwordToVerify = agl + '$' + user.salt + '$' + inter + '$' + user.password;
                        if (!hashPassword.verify(password, passwordToVerify)) {
                            res.send({
                                success: false,
                                message: 'Email or Password Error',
                                code: 404,
                                token: null
                            });
                            logger.userRegistrationLoginLog('userLogin', address, 'Password Error in: ' + userName);
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
                            });
                            logger.userRegistrationLoginLog(address, "Login Successfully in: " + userName);
                        }
                    }
                }
            }
        })
    }
});


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


router.post('/addInterest', verifyToken, (req, res) => {
    let userEmail = req.body.email;
    let interest = req.body.interest;
    let address = req.connection.remoteAddress;
    db.getTradingPair(interest.from, interest.to, interest.market, (err, msg) => {
        if (err) {
            databaseError(err, res);
            logger.databaseError('userLogin', address, err);
        } else {
            if (msg.rows[0] === null || msg.rows[0] === undefined) {
                db.addTradingPair(interest.from, interest.to, interest.market, (err, msg) => {
                    if (err) {
                        databaseError(err, res);
                        logger.databaseError('userLogin', address, err);
                    } else {
                        let coinID = msg.rows[0]._id;
                        db.addInterestWithOutTradingPair(userEmail, coinID, interest.price, interest.isGreater, (err, msg) => {
                            if (err) {
                                databaseError(err, res);
                                logger.databaseError('userLogin', address, err);
                            } else {
                                let coin = msg.rows[0];
                                res.send({
                                    success: true,
                                    message: "Interest Add to database",
                                    code: 200,
                                    data: coin
                                });
                                logger.userRegistrationLoginLog(address, "Interest add to database in Email: " + userEmail);
                            }
                        })
                    }
                })
            } else {
                let coinID = msg.rows[0]._id;
                db.addInterestWithTradingPair(userEmail, coinID, interest.price, interest.isGreater, (err, msg) => {
                    if (err) {
                        databaseError(err, res);
                        logger.databaseError('userLogin', address, err);
                    } else {
                        let coin = msg.rows[0];
                        res.send({
                            success: true,
                            message: "Interest Add to database",
                            code: 200,
                            data: coin
                        });
                        logger.userRegistrationLoginLog(address, "Interest add to database in Email: " + userEmail);
                    }
                })
            }
        }
    })
});


router.post('/editInterestStatus', verifyToken, (req, res) => {
    let userEmail = req.body.email;
    let interests = req.body.interest;
    let address = req.connection.remoteAddress;
    db.changeInterestStatus(interests, (err, msg) => {
        if (err) {
            databaseError(err, res);
            logger.databaseError('userLogin', address, err);
        } else {
            let interests = msg.rows;
            res.send({
                success: true,
                message: 'Success update Interest ststus',
                code: 200,
                data: interests
            });
            logger.userRegistrationLoginLog(address, "Interest add to database in Email: " + userEmail);
        }
    });
});


router.post('/editInterest', verifyToken, (req, res) => {
    let userEmail = req.body.email;
    let interest = req.body.interest;
    let address = req.connection.remoteAddress;
    db.getInterest(interest._id, (err, msg) => {
        if (err) {
            databaseError(err, res);
            logger.databaseError('userLogin', address, err);
        } else {
            let interestFromDB = msg.rows[0];
            if (interestFromDB === null || interestFromDB === undefined) {
                console.log("no interest found");
                logger.userRegistrationLoginLog(address, "No interest found in Email: " + userEmail);
                //TODO: to be add param err logger, this error means that the interest_id is not found or null.
                res.send({
                    success: false,
                    message: "No data found in database",
                    code: 404,
                    data: null
                })
            } else {
                if (interestFromDB.from === interest.from &&
                    interestFromDB.to === interest.to &&
                    interestFromDB.market === interest.market) {
                    // TODO update frequency
                    db.updateInterestPrice(interest._id, interest.price, interest.isGreater, (err, msg) => {
                        if (err) {
                            databaseError(err, res);
                            let address = req.connection.remoteAddress;
                            logger.databaseError('userLogin', address, err);
                        } else {
                            res.send({
                                success: true,
                                message: "Successfully Update interest",
                                code: 200,
                                data: msg.rows[0]
                            });
                            logger.userRegistrationLoginLog(address, "Successfully Update interest in Email: " + userEmail);
                        }
                    })
                } else {
                    // TODO update frequency
                    db.getTradingPair(interest.from, interest.to, interest.market, (err, msg) => {
                        if (err) {
                            databaseError(err, res);
                            logger.databaseError('userLogin', address, err);
                        } else {
                            if (msg.rows[0] === null || msg.rows[0] === undefined) {
                                db.addTradingPair(interest.from, interest.to, interest.market, (err, msg) => {
                                    if (err) {
                                        databaseError(err, res);
                                        logger.databaseError('userLogin', address, err);
                                    } else {
                                        let coinID = msg.rows[0]._id;
                                        db.updateInterestCoin(interest._id, coinID, interest.price, interest.isGreater, (err, msg) => {
                                            if (err) {
                                                databaseError(err, res);
                                                logger.databaseError('userLogin', address, err);
                                            } else {
                                                res.send({
                                                    success: true,
                                                    message: "Successfully update interest",
                                                    code: 200,
                                                    data: msg.rows[0]
                                                });
                                                logger.userRegistrationLoginLog(address, "Successfully update interest in Email: " + userEmail);
                                            }
                                        })
                                    }
                                })
                            } else {
                                let coinID = msg.rows[0]._id;
                                db.updateInterestCoin(interest._id, coinID, interest.price, interest.isGreater, (err, msg) => {
                                    if (err) {
                                        databaseError(err, res);
                                        let address = req.connection.remoteAddress;
                                        logger.databaseError('userLogin', address, err);
                                    } else {
                                        res.send({
                                            success: true,
                                            message: "Successfully update interest",
                                            code: 200,
                                            data: msg.rows[0]
                                        });
                                        logger.userRegistrationLoginLog(address, "Successfully update interest in Email: " + userEmail);
                                    }
                                })
                            }
                        }
                    })
                }
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
    let userEmail = req.body.email;
    let address = req.connection.remoteAddress;
    db.deleteInterest(interests, (err, msg) => {
        if (err) {
            databaseError(err, res);

            logger.databaseError('userLogin', address, err);
        } else {
            res.send({
                success: true,
                message: "Successfully delete Interest",
                code: 200,
                data: msg.rows
            });
            logger.userRegistrationLoginLog(address, "Successfully delete interest in Email: " + userEmail);
        }
    });
});


router.post('/getInterest', verifyToken, (req, res) => {
    let userEmail = req.body.email;
    let address = req.connection.remoteAddress;
    db.getInterests(userEmail, (err, msg) => {
        if (err) {
            databaseError(err, res);
            logger.databaseError('userLogin', address, err);
        } else {
            if (msg.rows[0] === undefined) {
                res.send({
                    success: false,
                    message: "interest not found",
                    code: 404,
                    data: null
                });
                logger.userRegistrationLoginLog(address, "Interest not found in Email: " + userEmail);
            } else {
                res.send({
                    success: true,
                    message: "Interest In Database",
                    code: 200,
                    data: msg.rows
                });
                logger.userRegistrationLoginLog(address, "Found Interest in db in Email: " + userEmail);
            }
        }
    })
});


router.post('/getNotificationStatus', verifyToken, (req, res) => {
    let userEmail = req.body.email;
    let address = req.connection.remoteAddress;
    db.getInterestStatus(userEmail, (err, msg) => {
        if (err) {
            databaseError(err);
            logger.databaseError('userLogin', address, err);
        } else {
            res.send({
                success: true,
                message: "Interest Status found",
                code: 200,
                data: msg.rows[0]
            });
            logger.userRegistrationLoginLog(address, "Interest status found in Email: " + userEmail);
        }
    })
});

router.get('/verify/:msg/:str', (req, res) => {
    try {
        let stringToken = req.params.msg;
        let str = req.params.str;
        if (stringToken === null || stringToken === undefined ||
            str === null || str === undefined) {
            res.sendFile(path.join(__dirname + '/error.html'));
        } else {
            let payload = jwt.verify(stringToken, str);
            if (!payload) {
                res.sendFile(path.join(__dirname + '/error.html'));
            } else {
                let token = payload.token;
                if (token === null || token === undefined) {
                    res.sendFile(path.join(__dirname + '/error.html'));
                } else {
                    db.removeFromVerifyTable(token, (err, msg) => {
                        if (err) {
                            databaseError(err, res);
                        } else {
                            if (msg.rows[0] === undefined) {
                                console.log("no user found");
                                res.sendFile(path.join(__dirname + '/notfound.html'));
                            } else {
                                let userID = msg.rows[0].user;
                                db.verifyUser(userID, (err, msgs) => {
                                    if (err){
                                        res.sendFile(path.join(__dirname + '/error.html'));
                                    } else {
                                        res.sendFile(path.join(__dirname + '/successVerify.html'));
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    } catch (err) {
        console.log(err);
        res.sendFile(path.join(__dirname + '/invalid_token.html'));
    }
});


router.get('/resetPassword/:email', (req, res) => {
    let email = req.params.email;
    db.getUser(email, (err, msg) => {
        if (err) {
            databaseError(err, res);
            //TODO: add log here
        } else {
            if (msg.rows[0] === undefined) {
                res.send({
                    message: 'no user found',
                    code: 404,
                    success: false,
                    token: null
                })
            } else {
                let user = msg.rows[0];
                let token = rs.generate(90);
                let key = rs.generate(40);
                let payload = {
                    token: token
                };
                let verifyToken = jwt.sign(payload, key, {expiresIn: 15 * 60});
                db.addIntoVerifyTable(user._id, token, (err, msg) => {
                    if (err) {
                        db.removeVerifyByReset(user._id, (err, msg) => {
                            if (err) {
                                databaseError(err, res);
                            } else {
                                db.addIntoVerifyTable(user._id, token, (err, msg) => {
                                    if (err) {
                                        databaseError(err, res);
                                    } else {

                                        let url = "http://localhost:3020/userLogin/reset/" + verifyToken + '/' + key;
                                        let mailOptions = {
                                            from: 'do-not-replay@cryptogeekapp.com',
                                            to: email,
                                            subject: '[CryptoGeek] Reset Password',
                                            html: "<body>\n" +
                                                "\t<div style=\" width: 600px; margin-left: auto; margin-right: auto; text-align: center;\">\n" +
                                                "\t\t<div style=\"background-color: #2d6095; padding: 25px; border-radius: 25px 25px 0px 0px;\">\n" +
                                                "\t\t\t<img src=\"https://firebasestorage.googleapis.com/v0/b/email-app-6e8c9.appspot.com/o/logo.png?alt=media&token=96644680-d278-4dad-ba4f-db8745eb8e27\" alt=\"\" style=\"height: 100px;\">\n" +
                                                "\t\t\t<h1 style=\"color: white;\">Password Reset Confirmation</h1>\n" +
                                                "\t\t</div>\n" +
                                                "\t\t<div style=\"background-color: #ffffff; border-radius: 0px 0px 25px 25px; border: 1px solid #dddddd; padding: 25px\">\n" +
                                                "\t\t\t<p>You have requested to reset your password in <b style=\"color: #2d6095\">CRYPTOGEEK</b>.</p>\n" +
                                                "\t\t\t<p>Please click the button to reset your password.</p>\n" +
                                                "\t\t\t<p>If you did not request to reset your password, please ignore this email.</p>\n" +
                                                "\t\t\t<a href=\""+url+"\"><button type=\"button\" style=\"width: 300px; height: 40px; font-size: 20px; font-weight: bold; color: #ffffff; background-color: #36ddab; border-radius: 10px; border: 0px; margin: 10px;\">Reset Password</button></a>\n" +
                                                "\t\t\t<p>If you unable to click the button, please use the URL below instead.</p>\n" +
                                                "\t\t\t<a href=\""+url+"\">"+url+"</a>\n" +
                                                "\t\t\t<p style=\"padding-top: 30px; color: #bbbbbb\">Copyright©CRYPTOGEEK</p>\n" +
                                                "\t\t</div>\n" +
                                                "\t</div>\n" +
                                                "</body>"
                                        };
                                        mail.send(mailOptions, (err, result) => {
                                            // res.send({result: result});
                                            res.send({
                                                message: 'successfully send email to reset password, email invalid in 15 mins',
                                                code: 202,
                                                success: true,
                                                token: null
                                            })
                                        })
                                    }
                                })
                            }
                        });
                    } else {
                        let url = "http://localhost:3020/userLogin/reset/" + verifyToken + '/' + key;
                        let mailOptions = {
                            from: 'do-not-replay@cryptogeekapp.com',
                            to: email,
                            subject: '[CryptoGeek] Reset Password',
                            html: "<body>\n" +
                                "\t<div style=\" width: 600px; margin-left: auto; margin-right: auto; text-align: center;\">\n" +
                                "\t\t<div style=\"background-color: #2d6095; padding: 25px; border-radius: 25px 25px 0px 0px;\">\n" +
                                "\t\t\t<img src=\"https://firebasestorage.googleapis.com/v0/b/email-app-6e8c9.appspot.com/o/logo.png?alt=media&token=96644680-d278-4dad-ba4f-db8745eb8e27\" alt=\"\" style=\"height: 100px;\">\n" +
                                "\t\t\t<h1 style=\"color: white;\">Password Reset Confirmation</h1>\n" +
                                "\t\t</div>\n" +
                                "\t\t<div style=\"background-color: #ffffff; border-radius: 0px 0px 25px 25px; border: 1px solid #dddddd; padding: 25px\">\n" +
                                "\t\t\t<p>You have requested to reset your password in <b style=\"color: #2d6095\">CRYPTOGEEK</b>.</p>\n" +
                                "\t\t\t<p>Please click the button to reset your password.</p>\n" +
                                "\t\t\t<p>If you did not request to reset your password, please ignore this email.</p>\n" +
                                "\t\t\t<a href=\""+url+"\"><button type=\"button\" style=\"width: 300px; height: 40px; font-size: 20px; font-weight: bold; color: #ffffff; background-color: #36ddab; border-radius: 10px; border: 0px; margin: 10px;\">Reset Password</button></a>\n" +
                                "\t\t\t<p>If you unable to click the button, please use the URL below instead.</p>\n" +
                                "\t\t\t<a href=\""+url+"\">"+url+"</a>\n" +
                                "\t\t\t<p style=\"padding-top: 30px; color: #bbbbbb\">Copyright©CRYPTOGEEK</p>\n" +
                                "\t\t</div>\n" +
                                "\t</div>\n" +
                                "</body>"
                        };
                        mail.send(mailOptions, (err, result) => {
                            // res.send({result: result});
                            res.send({
                                message: 'successfully send email to reset password, email invalid in 15 mins',
                                code: 202,
                                success: true,
                                token: null
                            })
                        })
                    }
                })
            }
        }
    });
});

//FIXME: start here
router.get('/reset/:verify/:key', (req, res) => {
    let verifyToken = req.params.verify;
    let key = req.params.key;
    try {
        if (verifyToken === null || verifyToken === undefined ||
            key === null || key === undefined) {
            res.sendFile(path.join(__dirname + '/error.html'));
        } else {
            let payload = jwt.verify(verifyToken, key);
            if (!payload) {
                res.sendFile(path.join(__dirname + '/error.html'));
            } else {
                let token = payload.token;
                if (token === null || token === undefined) {
                    res.sendFile(path.join(__dirname + '/error.html'));
                } else {
                    db.selectFromVerifyTable(token, (err, msg) => {
                        if (err) {
                            databaseError(err, res);
                        } else {
                            if (msg.rows[0] === undefined) {
                                console.log("no user found");
                                res.sendFile(path.join(__dirname + '/notfound.html'));
                            } else {
                                res.sendFile(path.join(__dirname + '/resetPassword.html'));
                            }
                        }
                    });
                }
            }
        }
    } catch (err) {
        console.log(err);
        if (err.name === 'TokenExpiredError') {
            res.sendFile(path.join(__dirname + '/invalid_token.html'));
        } else {
            res.sendFile(path.join(__dirname + '/error.html'));
        }
    }
});

// TODO: to finish the function here
router.post('/reset/:verify/:key', (req, res) => {
    let verify = req.params.verify;
    let key = req.params.key;
    let password = req.body.password;
    console.log(verify);
    console.log(key);
    console.log(password);
    try {
        if (verify === null || verify === undefined ||
            key === null || key === undefined) {
            res.sendFile(path.join(__dirname + '/error.html'));
        } else {
            let payload = jwt.verify(verify, key);
            if (!payload) {
                res.sendFile(path.join(__dirname + '/error.html'));
            } else {
                let token = payload.token;
                if (token === null || token === undefined) {
                    res.sendFile(path.join(__dirname + '/error.html'));
                } else {
                    db.removeFromVerifyTable(token, (err, msg) => {
                        if (err) {
                            databaseError(err, res);
                        } else {
                            if (msg.rows[0] === undefined) {
                                res.sendFile(path.join(__dirname + '/notfound.html'));
                            } else {
                                let id = msg.rows[0].user;
                                // TODO: add successful page
                                let passwordHash = hashPassword.generate(password, {
                                    algorithm: agl,
                                    saltLength: 15,
                                    iterations: inter
                                });
                                let st = passwordHash.split('$');
                                let passwordToDB = st[3];
                                let salt = st[1];
                                console.log(id);
                                db.updatePassword(id, passwordToDB, salt, (err, message) => {
                                    if (err) {
                                        databaseError(err, res);
                                    } else {
                                        console.log(message);
                                        res.sendFile(path.join(__dirname + '/successReset.html'));
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    } catch (err) {
        console.log(err);
        if (err.name === 'TokenExpiredError') {
            res.sendFile(path.join(__dirname + '/invalid_token.html'));
        } else {
            res.sendFile(path.join(__dirname + '/error.html'));
        }
    }
});
//FIXME: end here

router.get('/resendVerifyLink/:email', (req, res) => {
    let email = req.params.email;
    db.resendVerifyEmail(email, (err, msg) => {
        if (err) {
            databaseError(err, res);
        } else {
            let verify = msg.rows[0];
            if (verify === undefined) {
                res.send({
                    message: 'No verify code found',
                    success: false,
                    code: 404,
                    token: null
                })
            } else {
                let generate = verify.token;
                let key = rs.generate(40);
                let payload = {
                    token: generate
                };
                let verifyToken = jwt.sign(payload, key);
                let url = "http://localhost:3020/userLogin/verify/" + verifyToken + '/' + key;
                let mailOptions = {
                    from: 'do-not-replay@cryptogeekapp.com',
                    to: email,
                    subject: '[CryptoGeek] Please Verify Your Email',
                    html: "<body>\n" +
                        "\t<div style=\" width: 600px; margin-left: auto; margin-right: auto; text-align: center;\">\n" +
                        "\t\t<div style=\"background-color: #2d6095; padding: 25px; border-radius: 25px 25px 0px 0px;\">\n" +
                        "\t\t\t<img src=\"https://firebasestorage.googleapis.com/v0/b/email-app-6e8c9.appspot.com/o/logo.png?alt=media&token=96644680-d278-4dad-ba4f-db8745eb8e27\" alt=\"\" style=\"height: 100px;\">\n" +
                        "\t\t\t<h1 style=\"color: white;\">Email Address Verification</h1>\n" +
                        "\t\t</div>\n" +
                        "\t\t<div style=\"background-color: #ffffff; border-radius: 0px 0px 25px 25px; border: 1px solid #dddddd; padding: 25px\">\n" +
                        "\t\t\t<p>Thank you for creating a new account in <b style=\"color: #2d6095\">CRYPTOGEEK</b>.</p>\n" +
                        "\t\t\t<p>To complete your registration, we need you to verify your email address.</p>\n" +
                        "\t\t\t<a href=\""+url+"\"><button type=\"button\" style=\"width: 300px; height: 40px; font-size: 20px; font-weight: bold; color: #ffffff; background-color: #36ddab; border-radius: 10px; border: 0px; margin: 10px;\">Verify Email Address</button></a>\n" +
                        "\t\t\t<p>If you unable to click the button, please use the URL below instead.</p>\n" +
                        "\t\t\t<a href=\""+url+"\">"+url+"</a>\n" +
                        "\t\t\t<p style=\"padding-top: 30px; color: #bbbbbb\">Copyright©CRYPTOGEEK</p>\n" +
                        "\t\t</div>\n" +
                        "\t</div>\n" +
                        "</body>"
                };
                mail.send(mailOptions);
                res.send({
                    message: 'Please verify your email.',
                    code: 202,
                    success: true,
                    token: null
                })
            }
        }
    })
});


module.exports = router;

