let url = 'https://bittrex.com/api/v1.1/public/getmarkets';
let url2 = 'https://bittrex.com/api/v1.1/public/getmarketsummaries';


let url4='https://api.kraken.com/0/public/OHLC';


let url5 = 'https://marketdata.wavesplatform.com/api/v1/tickers';


let url6 = 'https://apiv2.bitcoinaverage.com/metadata';

let https = require('https');


https.get(url6,(res)=>{
    res.on("error", err => {
        console.log(err);
    });
    let data = '';
    res.on("data", d=>{
        data += d;
    });

    res.on("end", ()=>{
        // console.log(data);
        let JSONData = JSON.parse(data);
        console.log(JSONData);
        console.log();
    })
});