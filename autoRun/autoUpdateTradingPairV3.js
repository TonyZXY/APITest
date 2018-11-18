const coinAlgorithm = require('../dataServices/coinAlgorithm');
const db = require('../functions/postgredb');
const logger = require('../functions/logger');

// use this method to generate delay
const delay = amount => {
    return new Promise(resolve => {
        setTimeout(resolve, amount);
    });
};


// logic to update all trading pair user added. for every 2 mins
async function tradingpairUpdate() {
    do {
        // get add trading pair from PostgreSQL db
        db.getAllTradingPair((err, list) => {
            if (err) {
                console.log(err);
                logger.databaseError("AutoUpdateTradingPair", "Server", err);
            } else if (list.rows[0] === null || list.rows[0] === undefined) {
                console.log("currently no trading pair in database");
                logger.databaseError("AutoUpdateTradingPair", "db", "currently no trading pair in database");
            } else {
                // if no issues, pass to all list to update
                updateList(list.rows)
            }

        });
        console.log("update one time");
        logger.APIUpdateLog("AutoUpdateTradingPair", "CryptoCompare", "CryptoCompare trading pair updated");
        // wait 2 mins to start next loop
        await delay(120000)
    } while (true)
}


// update list of trading pair
// due to api limit, call 50 times every one second
// call 2000 times every one min
async function updateList(list) {
    if (list.length < 50) {
        list.forEach(tradingpair => {
            // pass trading pair into function that update this pair
            updateTradingPair(tradingpair)
        });
    } else if (list.length >= 50 && list.length < 2000) {
        for (i = 0; i < list.length; i++) {
            updateTradingPair(list[i]);
            if (i % 50 === 0 && i !== 0) {
                await delay(1000);
            }
        }
    } else if (list.length >= 2000 && list.length < 4000) {
        for (i = 0; i < list.length; i++) {
            updateTradingPair(list[i]);
            if (i % 50 === 0 && i % 2000 !== 0 && i !== 0) {
                await delay(1000);
            } else if (i % 2000 === 0 && i !== 0) {
                await delay(20000);
            }
        }
    }
}


// update trading pair
function updateTradingPair(tradingpair) {
    // call that file to update trading pair
    coinAlgorithm.getPriceFromAPI(tradingpair.from, tradingpair.to, tradingpair.market, (err, response) => {
        if (err) {
            console.log(err);
            logger.APIConnectionError("AutoUpdateTradingPair", "CyptoCompare", err);
        } else {
            let price = response;
            if (tradingpair.price === null || tradingpair.price === undefined || price !== tradingpair.price) {
                // update price into postgresql db
                db.updateTradingPair(tradingpair.coin_id, price, (err, msg) => {
                    if (err) {
                        console.log(err);
                        logger.databaseError("AutoUpdateTradingPair", "Server", err);
                    } else {
                    }
                });

            }
        }
    });
}


// run this function when node is called.
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
            