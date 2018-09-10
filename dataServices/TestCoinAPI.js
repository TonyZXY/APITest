const https = require('https');

// let options = {
//     method:"GET",
//     hostname:'rest.coinapi.io',
//     path:'/v1/symbols',
//     header:{
//         'X-CoinAPI-Key':'552E886A-FFDE-4CFE-B508-BBE4ED79EB60'
//     }
// };

let url = 'https://rest.coinapi.io/v1/quotes/BTC/latest?limit=100&apikey=552E886A-FFDE-4CFE-B508-BBE4ED79EB60';

https.get(url,(res)=>{
    let data = '';

    res.on('error',(err)=>{
        console.log(err);
    });

    res.on('data', (d)=>{
        data+=d;
    });

    res.on('end',()=>{
        // console.log(data);
        let jsonData = JSON.parse(data);
        console.log(jsonData.length);
    });

    console.log(res.headers)
});


