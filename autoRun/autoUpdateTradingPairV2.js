<<<<<<< HEAD
const coinAlgorithm = require('../functions/coinAlgorithm')
const db = require('../functions/postgredb')
const logger = require('../functions/logger')

var minute = 2;
=======
const coinAlgorithm = require('../functions/coinAlgorithm');
const db = require('../functions/postgredb');

let minute = 2;
>>>>>>> 17f33d8253c311142a1eb501580844ad21ea97db
the_internal = minute * 60 *1000;
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
<<<<<<< HEAD
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
=======
                    coinAlgorithm.getPriceFromAPI(tradingpair.from, tradingpair.to, tradingpair.market, (response) =>{
                        let price = response;
                        if(tradingpair.price === null || tradingpair.price === undefined || price !== tradingpair.price){
                        db.updateTradingPair(tradingpair.coin_id, price, (err,msg) =>{
                            if(err){
                                console.log(err)
                            } else {
                                console.log("update 1")
>>>>>>> 17f33d8253c311142a1eb501580844ad21ea97db
                            }
                        }
                       
              

                    });

            });
            console.log("update one time");
            //FIXME: need log here
        }
        


    })

},the_internal);