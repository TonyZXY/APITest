const mongoose = require('mongoose');


// schema for game coin, and method for read and write the mongodb for game coin

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

// get all game coin list
module.exports.getCoinList = (callback) =>{
    GameCoin.find(callback);
};

// add and edit the game coin
module.exports.addCoin = (coin,callback)=>{
    GameCoin.findOneAndUpdate({coin_name:coin.coin_name},coin,{upsert:true,returnNewDocument:true},callback);
};


