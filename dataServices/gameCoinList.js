const GameCoin = require('../module/GameCoin');
const https = require('https');
const mongoose = require('mongoose');
const config = require('../config');


mongoose.connect(config.database, config.options);


function call(coin) {
    let coinData = {};
    https.get('https://api.huobi.com.au/market/history/kline?period=1day&size=7&symbol=' + coin.coinAddName + 'aud', res => {
        res.on('error', err => {
            console.log(err);
        });
        let data = '';
        res.on('data', d => {
            data += d
        });
        res.on("end", () => {
            let JSONData = JSON.parse(data);
            coinData.coin_name = coin.coinAddName;
            coinData.coin_fullname = coin.coinName;
            coinData.exchangeName = coin.exchangeName;
            coinData.tradingPairName = coin.tradingPairName;
            let open = JSONData.data[0].open;
            let close = JSONData.data[6].close;
            coinData.current_price = close;
            coinData.one_week = (close-open)/open;

            https.get('https://api.huobi.com.au/market/history/kline?period=60min&size=1&symbol='+coin.coinAddName+'aud',res2=>{
                res2.on("error", err => {
                    console.log(err);
                });
                let data2 = '';
                res2.on("data", da=>{
                    data2 += da;
                });
                res2.on("end", ()=>{
                    let JSONData2 = JSON.parse(data2);
                    let open2 = JSONData2.data[0].open;
                    let close2 = JSONData2.data[0].close;
                    coinData.one_hour = (close2-open2)/open2;

                    https.get('https://api.huobi.com.au/market/history/kline?period=1day&size=1&symbol=' + coin.coinAddName + 'aud',res3=>{
                        res3.on("error", err => {
                            console.log(err);
                        });
                        let data3 = '';
                        res3.on("data", dat =>{
                            data3 += dat;
                        });
                        res3.on("end", ()=>{
                            let JSONData3 = JSON.parse(data3);
                            let open3 = JSONData3.data[0].open;
                            let close3 = JSONData3.data[0].close;
                            coinData.one_day = (close3-open3)/open3;

                            GameCoin.addCoin(coinData,(err,msg)=>{
                                if (err){
                                    console.log(err);
                                } else {
                                }
                            })
                        })
                    })
                })
            })
        })
    })
}

let coinList = [{
    coinName:'Bitcoin',
    coinAddName: 'btc',
    exchangeName: 'Huobi Australia',
    tradingPairName:'aud'
},{
    coinName:'Ethereum',
    coinAddName:'eth',
    exchangeName: 'Huobi Australia',
    tradingPairName:'aud'
},{
    coinName:'Bitcoin Cash',
    coinAddName:'bch',
    exchangeName: 'Huobi Australia',
    tradingPairName:'aud'
},{
    coinName:'Litecoin',
    coinAddName:'ltc',
    exchangeName: 'Huobi Australia',
    tradingPairName:'aud'
},{
    coinName:'Power Ledger',
    coinAddName:'powr',
    exchangeName: 'Huobi Australia',
    tradingPairName:'aud'
},{
    coinName:'Aelf',
    coinAddName:'elf',
    exchangeName: 'Huobi Australia',
    tradingPairName:'aud'
},{
    coinName:'Cortex',
    coinAddName:'ctxc',
    exchangeName: 'Huobi Australia',
    tradingPairName:'aud'
},{
    coinName:'DATA',
    coinAddName:'dta',
    exchangeName: 'Huobi Australia',
    tradingPairName:'aud'
},{
    coinName:'IOST',
    coinAddName:'iost',
    exchangeName: 'Huobi Australia',
    tradingPairName:'aud'
},{
    coinName:'Ethereum Classic',
    coinAddName:'etc',
    exchangeName: 'Huobi Australia',
    tradingPairName:'aud'
}];

function coinDataStart() {
    coinList.forEach(e => {
        call(e);
    })
}


async function runScript() {
    let time = 1;
    do {
        coinDataStart();
        loginConsole("Update Gaming Coin API from Huobi AU for " + time + " times");
        time++;
        await delay(1000 * 10);
    } while (true)
}


const delay = amount => {
    return new Promise(resolve => {
        setTimeout(resolve, amount);
    });
};


function loginConsole(msg) {
    console.log(
        new Date(Date.now()).toLocaleString() + " " + msg
    );
}


module.exports.run = () => {
    runScript();
};


module.exports.runOneTime = () =>{
    coinDataStart();
};

