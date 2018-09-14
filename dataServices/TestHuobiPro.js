const https = require('https');

let url = 'https://api.huobi.pro/v1/common/symbols';

https.get(url,(response)=>{
    response.on("error", (error)=>{
        console.log(error);
    });

    let data = '';

    response.on("data", (d)=>{
        data += d;
    });

    response.on("end", ()=>{
        let JSONData = JSON.parse(data);
        console.log(JSONData.data.length);
    })
});