var mongoose = require('mongoose');

var CustomerSchema = mongoose.Schema({
    userId:{
        type: String,
        require: true
    },
    deviceId:{
        type: [String],
        require: true
    }
})