var mongoose = require('mongoose');

var CustomerSchema = mongoose.Schema({
    fullName:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    gender: {
        type: String,
        require:false
    },
    age: {
        type: Number,
        require:false
    },
    password: {
        type: String,
        require: true
    }
});

var Customer = module.exports = mongoose.model('Customer',CustomerSchema);

module.exports.getUser = (email,callback)=>{
    Customer.findOne({
        email: email
    },callback);
};

module.exports.addUser = (costomer,callback)=>{
    Customer.create(costomer,callback);
};

module.exports.getUserList = (callback)=>{
    Customer.find(callback);
};

module.exports.removeUser = (id,callback)=> {
    let query = {
        _id:id
    };
    Customer.remove(query,callback);
};

