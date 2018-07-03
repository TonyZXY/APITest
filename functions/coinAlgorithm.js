const mongoose = require('mongoose');
const CoinInterest = require('../module/CoinInterest');
const request = require('request');

mongoose.connect('mongodb://localhost/APITest');

module.exports.getPriceFromAPI = function (coinFrom, coinTo, market, callback) {
    
    request({
        method: 'GET',
        uri: 'https://min-api.cryptocompare.com/data/generateAvg?fsym='+coinFrom+'&tsym='+coinTo+'&e='+market,
        headers: {'Content-type':'application/json'}
    }, function (error, response, body){
          if(error){
              console.log(error);
              return callback(error);
          }else{
              jsonObject = JSON.parse(body);
              console.log(jsonObject.RAW.PRICE)
              return callback(jsonObject.RAW.PRICE);
          }
    })
}
  