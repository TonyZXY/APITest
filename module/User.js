var mongoose = require('mongoose');


var userSchrma = mongoose.Schema(
    {
        username: {
            type: String,
            require: true
        },
        password: {
            type: String,
            require: true
        }
    }
);

var User = module.exports = mongoose.model('User',userSchrma);


//get password
module.exports.getPassword = (username, callback) => {
    User.find({username: username}, callback);
};

//set user
module.exports.setUpUsers = (user,callback) => {
    User.create(user,callback);
};

module.exports.get = (callback) => {
    User.find(callback);
};