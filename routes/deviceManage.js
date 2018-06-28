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

router.post('/addIOSDevice', function (req, res) {
    const device = req.body;
    IOSDevice.getDevice(device.deviceID, (err, device) => {
        if (err) {
            console.log(err);
        } else {
            if (device) {
                res.json(res);
            } else {
                IOSDevice.addDevice(device, (err, device) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.json(device);
                    }
                })
            }
        }
    })
});