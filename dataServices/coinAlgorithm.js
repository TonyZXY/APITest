const mongoose = require('mongoose');
const request = require('request');
const logger = require('../functions/logger');
const config = require('../config');
const Coin = require('../module/Coin');

mongoose.connect(config.database, config.options);

module.exports.getPriceFromAPI = function (coinFrom, coinTo, market, callback) {
    if (market === 'GLOBAL') {
        Coin.getOneCoin(coinFrom, (err, coin) => {
            let data = coin.quotes;
            data.forEach(element => {
                if (element.currency === coinTo) {
                    return callback(null, element.data.price)
                }
            })
        })
    } else if(market === 'Huobi Australia') {
        request({
            method: 'GET',
            uri: 'https://api.huobi.com.au/market/trade?symbol='+coinFrom.toLowerCase()+coinTo.toLowerCase(),
            headers: {'Content-type': 'application/json'}
        },(error, response, body)=>{
            if (error){
                console.log(error);
                logger.APIConnectionError('coinAlgorithm','HuobiAUAPI', error);
                return callback(error);
            } else {
                // console.log(body);
                let ObjectJSON = JSON.parse(body);
                // console.log(ObjectJSON.tick.data[0].price);
                return callback(null, ObjectJSON.tick.data[0].price)
            }
        });
    }else {
        request({
            method: 'GET',
            uri: 'https://min-api.cryptocompare.com/data/generateAvg?fsym=' + coinFrom + '&tsym=' + coinTo + '&e=' + market,
            headers: {'Content-type': 'application/json'}
        }, function (error, response, body) {
            if (error) {
                console.log(error);
                logger.APIConnectionError('coinAlgorithm', 'CryptoCompareAPI', error);
                return callback(error);
            } else {
                let jsonObject = JSON.parse(body);
                return callback(null, jsonObject.RAW.PRICE);
            }
        })
    }
};


const CoinFilter = require('../module/Coinfilter');
const coinfliter = require('../module/coinFliterNew');

function compareTwoAPI() {
    let array = [];
    request({
        method: 'GET',
        uri: 'https://min-api.cryptocompare.com/data/all/coinlist',
        headers: {'Content-type': 'application/json'}
    }, function (error, response, body) {
        if (error) {
            console.log(error);
            logger.APIConnectionError('coinAlgorithm', 'CryptoCompareAPI', error);
            return callback(error);
        } else {
            let jsonObject1 = JSON.parse(body);
            request({
                method: 'GET',
                uri: 'https://api.coinmarketcap.com/v2/listings/',
                headers: {'Content-type': 'application/json'}
            }, function (error, response, body2) {
                if (error) {
                    console.log(error);
                    logger.APIConnectionError('coinAlgorithm', 'CryptoCompareAPI', error);
                    return callback(error);
                } else {
                    let jsonObject = JSON.parse(body2);
                    let i = 0;
                    jsonObject.data.forEach(coin2 => {
                        for (var key in jsonObject1.Data) {
                            let coin1 = jsonObject1.Data[key];
                            let name1 = coin1.CoinName;
                            let name2 = coin2.name;
                            if (coin1.Symbol === coin2.symbol) {
                                let coin = new CoinFilter();
                                coin.coinName = coin1.CoinName;
                                coin.coinSymbol = coin1.Symbol;
                                coin.logoUrl = coin1.ImageUrl;
                                array.push(coin);
                            } else if (name2 === 'Holo' && name1 === 'Holo'){
                                // console.log(coin1.Symbol);
                                let coin = new CoinFilter();
                                coin.coinName = coin1.CoinName;
                                coin.coinSymbol = 'HOT*';
                                coin.logoUrl = coin1.ImageUrl;
                                array.push(coin);
                            }
                        }
                    });
                    let coins = new coinfliter();
                    coins.data = array;
                    coins.name = 'coins';
                    coinfliter.updateCoin(coins,'coins',(err,msg)=>{
                        if (err){
                            console.log(err);
                        } else {
                            // console.log(msg);
                            // console.log('Add to database');
                        }
                    })
                }
            })
        }
    });
    logger.APIUpdateLog("CoinAlgorithm", "server", "Compare and filter on Cyrpto Compare and Market Cap")
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
        await delay(24 * 3600 * 1000)
    } while (true)
}

module.exports.run = () => {
    start();
};


function loginConsole(times) {
    console.log(new Date(Date.now()).toLocaleString() + '  Run for ' + times + ' times.');
}

compareTwoAPI();

