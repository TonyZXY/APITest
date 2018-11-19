const https = require('https');
const Coin = require('../module/Coin');
const mongoose = require('mongoose');
const logger = require('../functions/logger');

const config = require('../config');

mongoose.connect(config.database, config.options);


// this file is to get data from coin market cap
// the global average data

// const url = 'https://api.coinmarketcap.com/v2/ticker/?convert=AUD&start=1&limit=100&sort=rank&structure=array';
const urlHead = 'https://api.coinmarketcap.com/v2/ticker/?structure=array&sort=rank&limit=100';
const AUD = 'AUD';
const EUR = 'EUR';
const CNY = 'CNY';
const JPY = 'JPY';
const startStr = '&start=';
const convert = '&convert=';

const currencys = [AUD, EUR, CNY, JPY];

let numberOfCoins = 1596;
let length = numberOfCoins / 100;


const delay = amount => {
    return new Promise(resolve => {
        setTimeout(resolve, amount);
    });
};
const second = 3;


// get data from coin market cap
async function forLoop(array, currency) {
    for (let i = 0; i < length; i++) {
        let start = i * 100 + 1;
        let url = urlHead + startStr + start + convert + currency;
        https.get(url, res => {
            let data = "";
            res.on("data", (d) => {
                data += d;
            });
            res.on("end", () => {
                let dataJSON = JSON.parse(data);
                let coinData = dataJSON.data;
                numberOfCoins = dataJSON.metadata.num_cryptocurrencies;
                coinData.forEach(coin => {
                    let coinToDB = {
                        id: coin.id,
                        name: coin.name,
                        symbol: coin.symbol,
                        website_slug: coin.website_slug,
                        rank: coin.rank,
                        circulating_supply: coin.circulating_supply,
                        total_supply: coin.total_supply,
                        max_supply: coin.max_supply,
                        quotes: [{
                            currency: 'USD',
                            data: coin.quotes.USD
                        }, {
                            currency: currency,
                            data: null
                        }],
                        last_updated: coin.last_updated
                    };
                    if (currency === CNY) {
                        coinToDB.quotes[1].data = coin.quotes.CNY;
                    } else if (currency === JPY) {
                        coinToDB.quotes[1].data = coin.quotes.JPY;
                    } else if (currency === EUR) {
                        coinToDB.quotes[1].data = coin.quotes.EUR;
                    } else if (currency === AUD) {
                        coinToDB.quotes[1].data = coin.quotes.AUD;
                    }
                    let found = array.find(element => {
                        return element.name === coinToDB.name;
                    });
                    if (found) {
                        array.splice(array.indexOf(found), 1);
                        found.quotes.push(coinToDB.quotes[1]);
                        array.push(found);
                    } else {
                        array.push(coinToDB);
                    }
                })
            })
        }).on('error', (err) => {
            logger.APIConnectionError("CoinGlobalAvg", "MarketCap", err);
            throw new Error(err);
        });
        await delay(second * 1000);
    }
}


// this method is make sure every currency price is generated
async function forCurrency(array) {
    for (let i = 0; i < currencys.length; i++) {
        await forLoop(array, currencys[i]);
    }
}

let time = 1;


// start the api call
function startcall() {
    let array = [];
    loginConsole(" start Loop for " + time);
    logger.APIUpdateLog("CoinGlobalAvg", "MarketCap", "MarketCap Gobal Average Start loop for " + time);
    time++;
    forCurrency(array).then(() => {
        array.forEach( element =>{
            if (element.name === 'Holo'){
                element.symbol = 'HOT*';
            }
        });
        Coin.addCoins(array, (err, msg) => {
            if (err) {
                console.log(err);
            } else {
            }
        });
        logger.APIUpdateLog("CoinGlobalAvg", "MarketCap", "MarketCap Gobal Average Added to database");
        delay(50 * 1000).then(() => {
            startcall();
        })
    });
}


function loginConsole(msg) {
    console.log(
        new Date(Date.now()).toLocaleString() + msg
    );
}

module.exports.run = () => {
    startcall()
};

