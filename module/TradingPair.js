var mongoose = require('mongoose');

var TradingPairSchema = mongoose.Schema({
    coinFrom:{
        type: String,
        require: true
    },
    coinTo:{
        type: String,
        require: true
    },
    market:{
        type: String,
        require: true 
    },
    price:{
        type: Number,
        require: true
    },
});

var TradingPair = module.exports = mongoose.model('TradingPair',TradingPairSchema);

module.exports.updateTradingPair = function (id,trpair,option,callback) {
    var query = {_id:id};
    var update = {
        price : trpair.price
    };
    TradingPair.findOneAndUpdate(query,update,option,callback);
};

module.exports.addTradingPair = function (trpair,callback) {
    TradingPair.create(trpair,callback);
};

module.exports.getTradingPairList = function(callback){
    TradingPair.find(callback);
}

module.exports.getOneTradingPair = function(coinFrom, coinTo, market, callback){
    TradingPair.findOne({
        coinFrom: coinFrom,
        coinTo: coinTo,
        market: market
    },callback);
}