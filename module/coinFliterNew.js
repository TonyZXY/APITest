const mongoose = require('mongoose');
// const logger = require('../functions/logger');


const coinFilterSchema = mongoose.Schema({
    data: [{
        coinName:{
            type:String,
            require:true
        },
        coinSymbol:{
            type: String,
            require: true
        },
        logoUrl: {
            type: String,
            require:true
        }
    }],
    name:{
        type:String,
        require:true
    }
});


const CoinFilterNew = module.exports = mongoose.model('CoinFilterNew',coinFilterSchema);


module.exports.getCoinList = (callback)=>{
    CoinFilterNew.findOne(callback);
};


module.exports.addCoin = (coin,callback)=>{
    CoinFilterNew.create(coin,callback);
};


module.exports.updateCoin = (coin,name,callback)=>{
    let update = {
        data: coin.data,
        name: coin.name
    };
    CoinFilterNew.findOneAndUpdate({name:name},update,{new:true},callback);
};

