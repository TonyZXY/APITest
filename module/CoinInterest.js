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
            price: Number,
            status: Boolean,
            id: String,
            isGreater: Number
        }]
    },
    status: {
        type: Boolean,
        default: true
    }
});

var Interest = module.exports = mongoose.model('Interest', interestSchema);

module.exports.getInterestList = (callback) => {
    Interest.find(callback);
};

module.exports.AddInterest = (userID, interest, callback) => {
    Interest.findOne({userID: userID}, (err, interestFromDB) => {
        if (err) {
            console.log(err)
        }
        if (!interestFromDB) {
            let interestToDB = {
                userID: userID,
                interest: [interest],
                status: true
            };
            Interest.create(interestToDB, callback);
        } else {
            Interest.findOneAndUpdate({userID: userID}, {
                $push:
                    {
                        interest: interest
                    }
            }, {new: true}, callback);
        }
    })
};

module.exports.updateInterest = (userID, interest, callback) => {
    Interest.findOneAndUpdate({userID: userID, "interest._id": interest._id},
        {
            $set: {
                "interest.$": interest
            }
        },{new:true}, callback
    );
};

module.exports.closeNotificationStatus = (userID, callback) => {
    Interest.findOne({userID: userID}, (err, msg) => {
        if (err) {
            console.log(err);
        } else {
            let statusToDB = !msg.status;
            Interest.findOneAndUpdate({userID: userID}, {$set: {status: statusToDB}}, {new: true}, callback);
        }
    });
};

module.exports.deleteInterest = (userID, interestID, callback) => {
    Interest.findOneAndUpdate({userID: userID}, {
        $pull: {
            interest: {
                _id: interestID
            }
        }
    }, {new: true}, callback);
};
