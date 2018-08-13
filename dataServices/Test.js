const https = require('https');

let coi = '';


function getCoinRequest() {
    try{
        https.get('https://cryptogeekapp.com/coin/getCoin?coin=BTC',(res)=>{
            let data = '';
            res.on('error',(err)=>{
                console.log(err);
                getCoinRequest();
            });
            res.on('data',(d)=>{
                data += d;
            });
            res.on('end',()=>{
                let coin = JSON.parse(data);
                console.log(coin);
                getNewsRequest()
            })
        })
    } catch (error){
        getCoinRequest()
    }
}


function getNewsRequest() {
    try{
        https.get('https://cryptogeekapp.com/api/getNewsContentOnly?languageTag=EN&limit=1&skip=0',(res)=>{
            let data = '';
            res.on('error',(err)=>{
                console.log(err);
                getNewsRequest();
            });
            res.on('data',(d)=>{
                data += d;
            });
            res.on('end',()=>{
                let coin = JSON.parse(data);
                console.log(coin);
                getCoinRequest()
            })
        })
    }catch (error) {
        getNewsRequest()
    }
}

function run() {
    for (let i = 0;i<100;i++){
        getCoinRequest();
    }
}

run();