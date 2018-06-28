
<<<<<<< HEAD
var CustomerSchema = mongoose.Schema({
    userId:{
        type: String,
        require: true
    },
    deviceId:{
        type: [String],
        require: true
=======
const mongoose = require('mongoose');

var coinNotificationIosDeviceSchema = mongoose.Schema({
    userID: {
        type: String,
        require: true
    },
    deviceID: {
        type: [String],
        require:true
>>>>>>> 2b366db2592eb58629f8dc0ad08b229fb37014b9
    }
});


