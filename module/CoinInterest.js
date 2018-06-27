const mongoose = require('mongoose');

const interestSchema = mongoose.Schema({
    userID: {
        type: String,
        require: true
    },
    interest: {
        type: [{
            coinFrom: String,
            coinTo: String,
            market: String,
            price: Number
        }]
    }
});

var Interest = module.exports = mongoose.model('Interest',interestSchema);

module.exports.getInterestList = (callback) => {
    Interest.find(callback);
};

module.exports.AddInterest = (userID,interest,callback)=>{
    Interest.findOne({userID:userID},(err,interestFromDB)=>{
        if (err) {
            console.log(err)
        } if (!interestFromDB) {
            let interestToDB = {
                userID: userID,
                interest: [interest]
            };
            Interest.create(interestToDB,callback);
        } else {
            Interest.findOneAndUpdate({userID:userID},{$push:{interest:interest}},{new:true},callback);
        }
    })
};