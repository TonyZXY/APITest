const mongoose = require('mongoose');
const request = require('request');
const logger = require('../functions/logger');

mongoose.connect('mongodb://localhost/APITest');

module.exports.getPriceFromAPI = function (coinFrom, coinTo, market, callback){
    request({
        method: 'GET',
        uri: 'https://min-api.cryptocompare.com/data/generateAvg?fsym='+coinFrom+'&tsym='+coinTo+'&e='+market,
        headers: {'Content-type':'application/json'}
    }, function (error, response, body){
          if(error){
            console.log(error);
            logger.APIConnectionError('coinAlgorithm','CryptoCompareAPI', error);
            return callback(error);
          }else{
            let jsonObject = JSON.parse(body);
              return callback(null,jsonObject.RAW.PRICE);
          }
    })
};




const CoinFilter = require('../module/Coinfilter');
function compareTwoAPI() {
    request({
        method: 'GET',
        uri: 'https://min-api.cryptocompare.com/data/all/coinlist',
        headers: {'Content-type':'application/json'}
    }, function (error, response, body){
          if(error){
            console.log(error);
            logger.APIConnectionError('coinAlgorithm','CryptoCompareAPI', error);
            return callback(error);
          }else{
            let jsonObject1 = JSON.parse(body);
            request({
                method: 'GET',
                uri: 'https://api.coinmarketcap.com/v2/listings/',
                headers: {'Content-type':'application/json'}
            }, function (error, response, body2){
                  if(error){
                    console.log(error);
                    logger.APIConnectionError('coinAlgorithm','CryptoCompareAPI', error);
                    return callback(error);
                  }else{
                    let jsonObject = JSON.parse(body2);
                    let i = 0;
                    jsonObject.data.forEach(coin2 => {
                        for(var key in jsonObject1.Data){
                           let coin1 = jsonObject1.Data[key];
                            if(coin1.Symbol === coin2.symbol){
                                // console.log(coin1.Symbol+"          "+coin2.symbol)
                                // i++
                                // console.log(i)
                                let coin = new CoinFilter();
                                coin.coinName = coin1.CoinName;
                                coin.coinSymbol = coin1.Symbol;
                                coin.logoUrl = coin1.ImageUrl;
                                CoinFilter.findCoinBySymbol(coin,(err,coinToAdd) =>{
                                    if(err){
                                        console.log(err);
                                        logger.databaseError('coinAlgorithm','server', error)
                                     } else {
                                         // console.log(coinToAdd)
                                     }
                                 })
                               
                            }
                        }
                    });
                    
                  }
            })
         } 
    });
    logger.APIUpdateLog("CoinAlgorithm","server","Compare and filter on Cyrpto Compare and Market Cap")
 }


const delay = (amount) => {
    return new Promise((resolve) => {
        setTimeout(resolve, amount);
    });
};

async function start() {
    let time = 1;
    do {
        loginConsole(time);
        compareTwoAPI();
        await delay(24*3600*1000)
    }while(true)
}

module.exports.run = () =>{
    start();
};


function loginConsole(times) {
    console.log(new Date(Date.now()).toLocaleString() + '  Run for ' + times + ' times.');
}