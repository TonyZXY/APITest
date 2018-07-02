const https = require('https');
const Coin = require('../module/Coin');
const mongoose = require('mongoose');

const options = {
    user: 'bglappdev100',
    pass: "appdevgkV6="
};

mongoose.connect('mongodb://localhost/APITest');


// const url = 'https://api.coinmarketcap.com/v2/ticker/?convert=AUD&start=1&limit=100&sort=rank&structure=array';
const urlHead = 'https://api.coinmarketcap.com/v2/ticker/?structure=array&sort=rank&limit=100';
const AUD = 'AUD';
const EUR = 'EUR';
const CNY = 'CNY';
const JPY = 'JPY';
const startStr = '&start=';
const convert = '&convert=';

const currencys = [AUD, EUR, CNY, JPY];

var numberOfCoins = 1596;
var length = numberOfCoins / 100;


const delay = amount => {
    return new Promise(resolve => {
        setTimeout(resolve, amount);
    });
};
const second = 2;

async function forLoop(array,currency) {
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
        });
        await delay(second*1000);
    }
}

async function forCurrency(array){
    for (let i=0;i<currencys.length;i++) {
        forLoop(array,currencys[i]);
        await delay(second*16*1000);
        loginConsole("Currency Loop. finish "+i+" currency");
    }
}


async function start() {
    let time = 1;
    do {
        let array = [];
        loginConsole("start Loop for " + time);
        time ++;
        forCurrency(array);
        await delay(second*64*1000);
        Coin.addCoins(array, (err, msg) => {
            if (err) {
                console.log(err);
            } else {
                console.log(msg);
            }
        });
        loginConsole("Add to database");
        await delay(300000-second*64000);
    } while (true);
}


function loginConsole(msg) {
    console.log(
        new Date(Date.now()).toLocaleString() + "  Time from " + msg + "."
    );
}

module.exports.run = ()=>{
    start()
};