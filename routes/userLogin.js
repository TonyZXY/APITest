const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Customer = require('../module/Customer');
const hashPassword = require('password-hash');
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://localhost/APITest');


router.post('/register', (req, res, next) => {
    const email = req.body.email;
    if (email === null || email === undefined) {
        res.send({
            success: false,
            message: 'Bad Request',
            code: 400,
            token: null
        })
    } else {
        Customer.getUser(email, (err, user) => {
            if (err) {
                console.log(err)
            } else {
                if (user) {
                    res.send({
                        success: false,
                        message: "email already sign up",
                        code: 409,
                        token: null
                    });
                } else {
                    let fullname = req.body.fullName;
                    let email = req.body.email;
                    let gender = req.body.gender;
                    let age = req.body.age;
                    let password = req.body.password;
                    if (fullname === null || fullname === undefined
                        || email === null || email === undefined
                        || password === null || password === undefined) {
                        res.send({
                            success: false,
                            message: "register fail",
                            code: 406,
                            token: null
                        })
                    } else {
                        if (gender === null || gender === undefined) {
                            gender = '';
                        }
                        if (age === null || age === undefined) {
                            age = -1;
                        }
                        let passwordToDB = hashPassword.generate(password, {
                            algorithm: 'sha256',
                            saltLength: 10,
                            iterations: 10
                        });
                        let userToDB = {
                            fullName: fullname,
                            email: email,
                            gender: gender,
                            age: age,
                            password: passwordToDB
                        };
                        Customer.addUser(userToDB, (err, userFromDB) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(userFromDB._id);
                                let payload = {
                                    userID: userFromDB._id,
                                    password: userFromDB.password
                                };
                                let tokenToSend = jwt.sign(payload, userFromDB.email);
                                console.log(userFromDB.password);
                                console.log(tokenToSend);
                                res.send({
                                    success: true,
                                    message: 'Register success',
                                    code: 200,
                                    token: tokenToSend
                                });
                            }
                        });
                    }
                }
            }
        })
    }
});

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username === null || username === undefined ||
        password === null || password === undefined) {
        res.send({
            success: false,
            message: "Login Fail",
            code: 406,
            token: null
        })
    } else {
        Customer.getUser(username, (err, userFromDB) => {
            if (err) {
                console.log(err);
            } else {
                if (!userFromDB) {
                    res.send({
                        success: false,
                        message: 'Email or Password Error',
                        code: 404,
                        token: null
                    })
                } else {
                    if (!hashPassword.verify(password, userFromDB.password)) {
                        res.send({
                            success: false,
                            message: 'Email or Password Error',
                            code: 404,
                            token: null
                        })
                    } else {
                        let payload = {
                            userID: userFromDB._id,
                            password: userFromDB.password
                        };
                        let tokenToSend = jwt.sign(payload, userFromDB.email);
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
    let token = req.headers.token;
    let email = req.headers.email;
    if (token === null || token === undefined ||
        email === null || email === undefined) {
        return res.send({
            success: false,
            message: "Token Error",
            code: 403,
            token: null
        })
    } else {
        let payload = jwt.verify(token, email);
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
                Customer.getUser(email, (err, user) => {
                    if (err) {
                        console.log(err);
                    } else {
                        if (!user) {
                            res.send({
                                success: false,
                                message: 'Token Error',
                                code: 403,
                                token: null
                            })
                        } else {
                            if (user.password !== password || user._id !== userID) {
                                res.send({
                                    success: false,
                                    message: "Token Error",
                                    code: 403,
                                    token: false
                                })
                            } else {
                                next()
                            }
                        }
                    }
                })
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

module.exports = router;

