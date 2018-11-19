const mongoose = require('mongoose');
const request = require('request');
const logger = require('../functions/logger');
const config = require('../config');
const Coin = require('../module/Coin');
const db = require('../functions/postgredb');

mongoose.connect(config.database, config.options);

// call this method to get data form api
module.exports.getPriceFromAPI = function (coinFrom, coinTo, market, callback) {
    if (market === 'GLOBAL') {
        // get data from global average
        Coin.getOneCoin(coinFrom, (err, coin) => {
            if (err) {
                console.log(err);
                logger.APIConnectionError('coinAlgorithm', 'MongoDBCoinPrice', err);
                return callback(err);
            } else {
                if (coin === null || coin === undefined) {
                    db.setCoinAvailable(coinFrom, false, (err, msg) => {
                        if (err) {
                            return callback(err)
                        } else {
                            logger.APIUpdateLog('CoinAlgorithm', 'server', 'Set Coin ' + coinFrom + ' available to false');
                        }
                    });
                    return callback("Coin not found: " + coinFrom);
                } else {
                    let data = coin.quotes;
                    if (data === null || data === undefined) {
                        db.setCoinAvailable(coinFrom, false, (err, msg) => {
                            if (err) {
                                return callback(err)
                            } else {
                                logger.APIUpdateLog('CoinAlgorithm', 'server', 'Set Coin ' + coinFrom + ' available to false');
                            }
                        });
                        return callback("Coin not found: " + coinFrom);
                    } else {
                        db.setCoinAvailable(coinFrom, true, (err, msg) => {
                            if (err) {
                                return callback(err);
                            } else {
                            }
                        });
                        data.forEach(element => {
                            if (element.currency === coinTo) {
                                return callback(null, element.data.price)
                            }
                        })
                    }
                }
            }
        })
        // get data from huobi australia
    }else if(market === 'Huobi Australia') {
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
                let ObjectJSON = JSON.parse(body);
                return callback(null, ObjectJSON.tick.data[0].price)
            }
        });
    } else {
        // get data from cryptocompare
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



// this function is to generate a list of coin which two apis in common
async function compareTwoAPI() {
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
                    jsonObject.data.forEach(coin2 => {
                        for (let key in jsonObject1.Data) {
                            let coin1 = jsonObject1.Data[key];
                            let name1 = coin1.CoinName;
                            let name2 = coin2.name;
                            if (coin1.Symbol === coin2.symbol) {
                                let coin = new CoinFilter();
                                coin.coinName = coin1.CoinName;
                                coin.coinSymbol = coin1.Symbol;
                                coin.logoUrl = coin1.ImageUrl;
                                array.push(coin);
                            } else if (name1 === 'Holo' && name2 === 'Holo'){
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
                    coinfliter.updateCoin(coins, 'coins', (err, msg) => {
                        if (err) {
                            logger.APIConnectionError('coinAlgorithm', 'Update coin filter', err);
                        } else {
                        }
                    })
                }
            })
        }
    });
}


const delay = (amount) => {
    return new Promise((resolve) => {
        setTimeout(resolve, amount);
    });
};


// call this method to start this file
// this function start every day
// this function is start to compare two apis
function start() {
    let time = 1;
    loginConsole(time);
    compareTwoAPI().then(() => {
        logger.APIUpdateLog("CoinAlgorithm", "server", "Compare and filter on Cyrpto Compare and Market Cap");
        delay(24 * 3600 * 1000).then(() => {
            time++;
            start();
        })
    })
}

module.exports.run = () => {
    start();
};


function loginConsole(times) {
    console.log(new Date(Date.now()).toLocaleString() + '  Run for ' + times + ' times.');
}