const express = require('express');
const router = express.Router();
const hashPassword = require('password-hash');
const jwt = require('jsonwebtoken');
const db = require('../functions/postgredb');
const logger = require('../functions/logger')
const rs = require('randomstring');
const mail = require('@sendgrid/mail');
const path = require('path');

mail.setApiKey('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');

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
        logger.userRegistrationLoginLog(address,"Invalid params");
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
                logger.databaseError("userLogin",address, err);
                if(err.code === '23505'){
                    logger.userRegistrationLoginLog(address,"May be already registed in: " + email);
                }
            } else {
                let generate = rs.generate(90);
                let key = rs.generate(40);
                let payload = {
                    token: generate
                };
                let verifyToken = jwt.sign(payload, key);
                db.addIntoVerifyTable(msg.rows[0].user_id, generate, (err, msg) => {
                    let url = "https://bglnewsbkend.tk/userLogin/verify/" + verifyToken + '/' + key;
                    let mailOptions = {
                        from: 'do-not-replay@blockchainglobal.com',
                        to: email,
                        subject: 'Sending from node project to verify',
                        text: url
                    };
                    mail.send(mailOptions);
                    res.send({
                        message: 'Please verify your email.',
                        code: 202,
                        success: true,
                        token: null
                    })
                });
                logger.userRegistrationLoginLog(address,"Registed Successfully in: " + email);
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
                            code: 888,
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
        //TODO Add err log and page here
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
            logger.databaseError('userLogin',address, err);
        } else {
            if (msg.rows[0] === null || msg.rows[0] === undefined) {
                db.addTradingPair(interest.from, interest.to, interest.market, (err, msg) => {
                    if (err) {
                        databaseError(err, res);
                        logger.databaseError('userLogin',address, err);
                    } else {
                        let coinID = msg.rows[0]._id;
                        db.addInterestWithOutTradingPair(userEmail, coinID, interest.price, interest.isGreater, (err, msg) => {
                            if (err) {
                                databaseError(err, res);
                                logger.databaseError('userLogin',address, err);
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
                        logger.databaseError('userLogin',address, err);
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
            logger.databaseError('userLogin',address, err);
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
            logger.databaseError('userLogin',address, err);
        } else {
            let interestFromDB = msg.rows[0];
            if (interestFromDB === null || interestFromDB===undefined){
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
            
            logger.databaseError('userLogin',address, err);
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
            logger.databaseError('userLogin',address, err);
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
            logger.databaseError('userLogin',address, err);
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
            //TODO: add error page
            res.send({
                message: 'error in passing params'
            })
        } else {
            let payload = jwt.verify(stringToken, str);
            if (!payload) {
                //TODO: add error page
                res.send({
                    message: 'error in verify payload'
                })
            } else {
                let token = payload.token;
                if (token === null || token === undefined) {
                    // TODO: add error page
                    res.send({
                        message: 'error in getting payload'
                    })
                } else {
                    db.removeFromVerifyTable(token, (err, msg) => {
                        if (err) {
                            databaseError(err, res);
                        } else {
                            if (msg.rows[0] === undefined) {
                                console.log("no user found");
                                //TODO: add error page
                                res.send({msg: 'no user found'});
                            } else {
                                // TODO: add successful page
                                let userID = msg.rows[0].user;
                                db.verifyUser(userID, (err, msgs) => {
                                    res.send('successfully verified')
                                });
                            }
                        }
                    });
                }
            }
        }
    } catch (err) {
        console.log(err);
        //TODO: add error page
        res.send({
            message: 'invalid token'
        });
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

                                        let url = "https://bglnewsbkend.tk/userLogin/reset/" + verifyToken + '/' + key;
                                        let mailOptions = {
                                            from: 'do-not-replay@blockchainglobal.com',
                                            to: email,
                                            subject: 'Sending from node project to reset',
                                            text: url
                                        };
                                        mail.send(mailOptions, (err, result) => {
                                            // res.send({result: result});
                                            res.send({
                                                message:'successfully send email to reset password, email invalid in 15 mins',
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
                        let url = "https://bglnewsbkend.tk/userLogin/reset/" + verifyToken + '/' + key;
                        let mailOptions = {
                            from: 'do-not-replay@blockchainglobal.com',
                            to: email,
                            subject: 'Sending from node project to reset',
                            text: url
                        };
                        mail.send(mailOptions, (err, result) => {
                            // res.send({result: result});
                            res.send({
                                message:'successfully send email to reset password, email invalid in 15 mins',
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


router.get('/reset/:verify/:key', (req, res) => {
    let verifyToken = req.params.verify;
    let key = req.params.key;
    try {
        if (verifyToken === null || verifyToken === undefined ||
            key === null || key === undefined) {
            //TODO: add error page
            res.send({
                message: 'error in passing params'
            })
        } else {
            let payload = jwt.verify(verifyToken, key);
            if (!payload) {
                //TODO: add error page
                res.send({
                    message: 'error in verify payload'
                })
            } else {
                let token = payload.token;
                if (token === null || token === undefined) {
                    // TODO: add error page
                    res.send({
                        message: 'error in getting payload'
                    })
                } else {
                    db.selectFromVerifyTable(token, (err, msg) => {
                        if (err) {
                            databaseError(err, res);
                        } else {
                            if (msg.rows[0] === undefined) {
                                console.log("no user found");
                                //TODO: add error page
                                res.send({msg: 'no user found'});
                            } else {
                                // TODO: add successful page
                                res.sendFile(path.join(__dirname+'/resetPassword.html'));
                                // res.send({
                                //     message:'successfully verified and begin to reset',
                                //     data:msg.rows[0]
                                // });
                            }
                        }
                    });
                }
            }
        }
    } catch (err) {
        console.log(err);
        if (err.name === 'TokenExpiredError') {
            res.send('expired');
        } else {
            res.send('Token error');
        }
    }
});


router.post('/reset/:verify/:key',(req,res)=>{
    let verify = req.params.verify;
    let key = req.params.key;
    let password = req.body.password;
    console.log(verify);
    console.log(key);
    console.log(password);
    try {
        if (verify === null || verify === undefined ||
            key === null || key === undefined) {
            //TODO: add error page
            res.send({
                message: 'error in passing params'
            })
        } else {
            let payload = jwt.verify(verify, key);
            if (!payload) {
                //TODO: add error page
                res.send({
                    message: 'error in verify payload'
                })
            } else {
                let token = payload.token;
                if (token === null || token === undefined) {
                    // TODO: add error page
                    res.send({
                        message: 'error in getting payload'
                    })
                } else {
                    db.removeFromVerifyTable(token, (err, msg) => {
                        if (err) {
                            databaseError(err, res);
                        } else {
                            if (msg.rows[0] === undefined) {
                                console.log("no user found");
                                //TODO: add error page
                                res.send({msg: 'no user found'});
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
                                db.updatePassword(id,passwordToDB,salt,(err,message)=>{
                                    if(err){
                                        databaseError(err,res);
                                    }else {
                                        console.log(message);
                                        res.send({
                                            success: true,
                                            code:200,
                                            message: "successfully reset password",
                                            token: null,
                                        })
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
            res.send('expired');
        } else {
            res.send('Token error');
        }
    }
});



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
                let url = "https://bglnewsbkend.tk/userLogin/verify/" + verifyToken + '/' + key;
                let mailOptions = {
                    from: 'do-not-replay@blockchainglobal.com',
                    to: email,
                    subject: 'Sending from node project to verify',
                    text: url
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

