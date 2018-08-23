const mongoose = require('mongoose');


const userSchrma = mongoose.Schema(
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

const User = module.exports = mongoose.model('User', userSchrma);


//get password
module.exports.getPassword = (username, callback) => {
    User.findOne({username: username}, callback);
};

//set user
module.exports.setUpUsers = (user, callback) => {
    User.create(user, callback);
};

module.exports.get = (callback) => {
    User.find(callback);
};
