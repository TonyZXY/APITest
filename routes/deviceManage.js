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
<<<<<<< HEAD
    Device.getDevice(device.deviceId, function(err,device){
        if(!device){
            Device.addNews(device, function (err, news) {
                if (err) {
                    console.log(err);
                }
                res.json(news);
            })
        } else{
            
=======
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
>>>>>>> 2b366db2592eb58629f8dc0ad08b229fb37014b9
        }
    })
});