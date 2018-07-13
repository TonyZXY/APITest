
const coinAlgorithm = require('../functions/coinAlgorithm');
const db = require('../functions/postgredb');

let secondTime = 0; // limit 50
let minuteTime = 0; // limit 2000
let hourTime = 0;  // limit 100000
let minute = 2;
let the_internal = minute * 60 *1000;
setInterval(function(){
    db.getAllTradingPair((err,list) =>{
        if(err){
            console.log(err);
            logger.databaseError("AutoUpdateTradingPair", "Server", err);
        } else if(list.rows[0] ===null || list.rows[0]===undefined){
            console.log("currently no trading pair in database");
            logger.databaseError("AutoUpdateTradingPair", "db", "currently no trading pair in database");
        } else{
            list.rows.forEach(tradingpair => {
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

            });
            console.log("update one time");
            //FIXME: need log here
        }
        


    })

},the_internal);