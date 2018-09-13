const https = require('https');

const request = require('request');


let url = 'https://api.huobi.com.au/market/trade?symbol=ethaud';

// https.get(url,(res)=>{
//     res.on("error", (err)=>{
//         console.log(err);
//     });
//
//     let data = '';
//     res.on("data", (d)=>{
//         data += d;
//     });
//
//     res.on("end", ()=>{
//         let JSONData = JSON.parse(data);
//
//         console.log(JSONData.tick.data[0].price);
//
//     })
//
// });


request({
    method: 'GET',
    uri: 'https://api.huobi.com.au/market/trade?symbol=',
    headers: {'Content-type': 'application/json'}
},(error, response, body)=>{
    if (error){
        console.log(error);
    } else {
        console.log(body);
        let ObjectJSON = JSON.parse(body);
        console.log(ObjectJSON.tick.data[0].price);
    }
});
