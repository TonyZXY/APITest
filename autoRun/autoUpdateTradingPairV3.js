const coinAlgorithm = require('../dataServices/coinAlgorithm');
const db = require('../functions/postgredb');
const logger = require('../functions/logger');

let secondTime = 0; // limit 50
let minuteTime = 0; // limit 2000
let hourTime = 0;  // limit 100000

const delay = amount => {
    return new Promise(resolve => {
        setTimeout(resolve, amount);
    });
};
async function tradingpairUpdate(){
    do{
        db.getAllTradingPair((err,list) =>{
            if(err){
                console.log(err);
                logger.databaseError("AutoUpdateTradingPair", "Server", err);
            } else if(list.rows[0] ===null || list.rows[0]===undefined){
            console.log("currently no trading pair in database");
            logger.databaseError("AutoUpdateTradingPair", "db", "currently no trading pair in database");
            } else{
                updateList(list.rows)
            }
        
        });
        console.log("update one time");
        logger.APIUpdateLog("AutoUpdateTradingPair","CryptoCompare","CryptoCompare trading pair updated")
        await delay(120000)
    }while(true)  
}


async function updateList(list){
    if(list.length < 50){
        list.forEach(tradingpair => {
            updateTradingPair(tradingpair)
        });
        // await delay(120000)
    } else if(list.length>=50 && list.length<2000) {
        for(i=0;i<list.length; i++) {
            updateTradingPair(list[i]);
            if(i%50===0 && i !==0){
                await delay(1000);
            }
        }
        // await delay(12000 - );
    } else if(list.length>=2000 && list.length<4000) {
        for(i=0;i<list.length; i++) {
            updateTradingPair(list[i]);
            if(i%50===0 && i%2000 !==0 && i !==0){
                await delay(1000);
            } else if(i%2000===0 && i !== 0){
                await delay(20000);
            }
        }
    } 
}

function updateTradingPair(tradingpair){
    coinAlgorithm.getPriceFromAPI(tradingpair.from, tradingpair.to, tradingpair.market, (err, response) =>{
        if(err){
            console.log(err);
            logger.APIConnectionError("AutoUpdateTradingPair", "CyptoCompare", err);
        }else{
            price = response;
            if(tradingpair.price === null || tradingpair.price === undefined || price !== tradingpair.price){
                db.updateTradingPair(tradingpair.coin_id, price, (err,msg) =>{
                    if(err){
                        console.log(err);
                        logger.databaseError("AutoUpdateTradingPair", "Server", err);
                    } else {
                    }
                });

            }
        }
    });
}
tradingpairUpdate();

// TODO: future function for more trading pairs
//else if (list.length>=2000 && list.length< 100000){
    //     for(i=0;i<list.length; i++) {
    //         updateTradingPair(list[i]);
    //         if(i%50===0 && i%2000 !== 0){
    //             await delay(1000);
    //         } else if (i%2000 ===0){
    //             await delay(2000)
    //         }
    //     }
    // } else{
    //     for(i=0;i<list.length; i++) {
    //         updateTradingPair(list[i]);
    //         if(i%50===0 && i%2000 !== 0 && i%100000 !==0){
    //             await delay(1000);
    //         } else if (i%2000 ===0 && i%100000 !==0){
    //             await delay(2000)
    //         } else if(i%100000 === 0){
    //             await delay(600000)
    //         }
    //     }
            