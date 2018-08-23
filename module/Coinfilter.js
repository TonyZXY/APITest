const mongoose = require('mongoose');
const logger = require('../functions/logger')

const coinFilterSchema = mongoose.Schema({
    coinName: {
        type: String,
        require: true
    },
    coinSymbol: {
        type: String,
        require: true
    },
    logoUrl: {
        type: String,
        require: true
    }

});
const CoinFilter = module.exports = mongoose.model('CoinFilter', coinFilterSchema);

module.exports.getCoinList = (callback) => {
    CoinFilter.find(callback);
};

module.exports.addCoin = function (coin, callback) {
    CoinFilter.create(coin, callback);
};
module.exports.findCoinBySymbol = (coin, callback) => {
    CoinFilter.findOne({coinSymbol: coin.coinSymbol}, (err, coinToSearch) => {
        if (err) {
            console.log(err);
            logger.databaseError("Coinfilter", "server", err);
        } else if (!coinToSearch) {
            CoinFilter.create(coin, callback);
        } else {
            // console.log("this has been added")
        }
    });
};
module.exports.deleteCoinById = (id, callback) => {
    CoinFilter.findOneAndRemove({_id: id}, callback)
};