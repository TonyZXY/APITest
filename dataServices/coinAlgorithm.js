const mongoose = require('mongoose');
const request = require('request');
const logger = require('../functions/logger');
const config = require('../config');
const Coin = require('../module/Coin');
const db = require('../functions/postgredb');

mongoose.connect(config.database, config.options);

module.exports.getPriceFromAPI = function (coinFrom, coinTo, market, callback) {
    if (market === 'GLOBAL') {
        Coin.getOneCoin(coinFrom, (err, coin) => {
            if (err) {
                console.log(err);
                logger.APIConnectionError('coinAlgorithm', 'MongoDBCoinPrice', err);
                return callback(err);
            } else {
                if (coin === null || coin === undefined) {
                    console.log("Coin not found: " + coinFrom);
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
                        console.log("Coin not found: " + coinFrom);
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
    } else {
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
                            if (coin1.Symbol === coin2.symbol) {
                                // console.log(coin1.Symbol+"          "+coin2.symbol)
                                // i++
                                // console.log(i)
                                let coin = new CoinFilter();
                                coin.coinName = coin1.CoinName;
                                coin.coinSymbol = coin1.Symbol;
                                coin.logoUrl = coin1.ImageUrl;
                                array.push(coin);
                                // CoinFilter.findCoinBySymbol(coin, (err, coinToAdd) => {
                                //     if (err) {
                                //         console.log(err);
                                //         logger.databaseError('coinAlgorithm', 'server', error)
                                //     } else {
                                //         // console.log(coinToAdd)
                                //     }
                                // })
                            }
                        }
                    });
                    let coins = new coinfliter();
                    coins.data = array;
                    coins.name = 'coins';
                    coinfliter.updateCoin(coins,'coins',(err,msg)=>{
                        if (err){
                            logger.APIConnectionError('coinAlgorithm','Update coin filter',err);
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

function start() {
    let time = 1;
    loginConsole(time);
    compareTwoAPI().then(()=>{
        logger.APIUpdateLog("CoinAlgorithm", "server", "Compare and filter on Cyrpto Compare and Market Cap");
        delay(24*3600*1000).then(()=>{
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