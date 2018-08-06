// const https = require('https');
//
// https.get('https://cryptogeekapp.com/coin/getCoin?coin=BTC',(res)=>{
//     let data='';
//     res.on('error', (err)=>{
//         console.log(err)
//     });
//     res.on('data', function (d) {
//         data += d;
//     });
//     res.on('end', function () {
//         let coin = JSON.parse(data);
//         let aaa = coin.quotes;
//         aaa.forEach( element=>{
//             // console.log(price);
//             if(element.currency==='AUD'){
//                 console.log(element.data.price);
//             }
//         });
//         // console.log(aaa);
//     })
// });

const mongoose = require('mongoose');
const config = require('../config');
const Coin = require('../module/Coin');

mongoose.connect(config.database);

let symbol = 'BTC';
let currency = 'AUD';


let coin = Coin.getOneCoin(symbol,(err,coin)=>{
    // console.log(coin.quotes);
    let data = coin.quotes;
    data.forEach(element=>{
        if (element.currency === currency){
            console.log(element.data.price);
        }
    })
});