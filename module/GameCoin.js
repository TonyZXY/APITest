const mongoose = require('mongoose');


const gameCoinSchema = mongoose.Schema({
    coin_name:String,
    coin_fullname:String,
    exchangeName:String,
    tradingPairName:String,
    current_price:Number,
    one_week:Number,
    one_day:Number,
    one_hour:Number
});


const GameCoin = module.exports = mongoose.model('GameCoin',gameCoinSchema);

module.exports.getCoinList = (callback) =>{
    GameCoin.find(callback);
};


module.exports.addCoin = (coin,callback)=>{
    GameCoin.findOneAndUpdate({coin_name:coin.coin_name},coin,{upsert:true,returnNewDocument:true},callback);
};


