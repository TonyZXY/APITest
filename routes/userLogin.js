const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Customer = require('../module/Customer');
const hashPassword = require('password-hash');
const jwt = require('jsonwebtoken');
const Interest = require('../module/CoinInterest');
const InterestNotification = require('../module/CoinNotificationIOS');
const db = require('../functions/postgredb');

mongoose.connect('mongodb://localhost/APITest');

const agl = 'sha256';
const inter = 20;


// router.post('/register', (req, res, next) => {
//     const email = req.body.email;
//     if (email === null || email === undefined) {
//         res.send({
//             success: false,
//             message: 'Bad Request',
//             code: 400,
//             token: null
//         })
//     } else {
//         Customer.getUser(email, (err, user) => {
//             if (err) {
//                 console.log(err)
//             } else {
//                 if (user) {
//                     res.send({
//                         success: false,
//                         message: "email already sign up",
//                         code: 409,
//                         token: null
//                     });
//                 } else {
//                     let firstName = req.body.firstName;
//                     let lastName = req.body.lastName;
//                     let email = req.body.email;
//                     let title = req.body.title;
//                     let password = req.body.password;
//                     if (firstName === null || firstName === undefined ||
//                         lastName === null || lastName === undefined ||
//                         email === null || email === undefined ||
//                         password === null || password === undefined) {
//                         res.send({
//                             success: false,
//                             message: "register fail",
//                             code: 406,
//                             token: null
//                         })
//                     } else {
//                         if (title === null || title === undefined) {
//                             title = '';
//                         }
//                         let passwordToDB = hashPassword.generate(password, {
//                             algorithm: 'sha256',
//                             saltLength: 10,
//                             iterations: 10
//                         });
//                         let userToDB = {
//                             firstName: firstName,
//                             lastName: lastName,
//                             email: email,
//                             title: title,
//                             password: passwordToDB
//                         };
//                         Customer.addUser(userToDB, (err, userFromDB) => {
//                             if (err) {
//                                 console.log(err);
//                             } else {
//                                 console.log(userFromDB._id);
//                                 let payload = {
//                                     userID: userFromDB._id,
//                                     password: userFromDB.password
//                                 };
//                                 let tokenToSend = jwt.sign(payload, userFromDB.email);
//                                 console.log(userFromDB.password);
//                                 console.log(tokenToSend);
//                                 console.log(tokenToSend.length);
//                                 res.send({
//                                     success: true,
//                                     message: 'Register success',
//                                     code: 200,
//                                     token: tokenToSend
//                                 });
//                             }
//                         });
//                     }
//                 }
//             }
//         })
//     }
// });

router.post('/register', (req, res, next) => {
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

// router.post('/login', (req, res) => {
//     const username = req.body.userEmail;
//     const password = req.body.password;
//     if (username === null || username === undefined ||
//         password === null || password === undefined) {
//         res.send({
//             success: false,
//             message: "Login Fail",
//             code: 406,
//             token: null
//         })
//     } else {
//         Customer.getUser(username, (err, userFromDB) => {
//             if (err) {
//                 console.log(err);
//             } else {
//                 if (!userFromDB) {
//                     res.send({
//                         success: false,
//                         message: 'Email or Password Error',
//                         code: 404,
//                         token: null
//                     })
//                 } else {
//                     if (!hashPassword.verify(password, userFromDB.password)) {
//                         res.send({
//                             success: false,
//                             message: 'Email or Password Error',
//                             code: 404,
//                             token: null
//                         })
//                     } else {
//                         let payload = {
//                             userID: userFromDB._id,
//                             password: userFromDB.password
//                         };
//                         let tokenToSend = jwt.sign(payload, userFromDB.email);
//                         console.log(tokenToSend);
//                         res.send({
//                             success: true,
//                             message: 'Login Success',
//                             code: 200,
//                             token: tokenToSend
//                         })
//                     }
//                 }
//             }
//         })
//     }
// });

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


router.get('/users', (req, res) => {
    Customer.getUserList((err, users) => {
        if (err) {
            console.log(err)
        }
        res.json(users);
    })
});

router.delete('/users/:_id', (req, res) => {
    let id = req.params._id;
    console.log(id);
    Customer.removeUser(id, (err, mes) => {
        if (err) {
            console.log(err);
        }
        res.json(mes);
    })
});

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

