const mongoose = require('mongoose');

const CustomerSchema = mongoose.Schema({
    firstName:{
        type: String,
        require: true
    },
    lastName:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    title: {
        type: String,
        require:false
    },
    password: {
        type: String,
        require: true
    }
});

const Customer = module.exports = mongoose.model('Customer',CustomerSchema);

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

