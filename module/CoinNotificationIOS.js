var mongoose = require('mongoose');

var CustomerSchema = mongoose.Schema({
    fullName:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    }
})