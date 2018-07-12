const coinAlgorithm = require('../functions/coinAlgorithm')
const db = require('../functions/postgredb')

var minute = 2
the_internal = minute * 60 *1000
setInterval(function(){
    console.log("Check for update");
    db.getAllTradingPair((err,list) =>{
        if(err){
            console.log(err)
        } else if(list.rows[0] ===null || list.rows[0]===undefined){
            console.log("currently no trading pair in database")
        } else{
            list.rows.forEach(tradingpair => {
                    coinAlgorithm.getPriceFromAPI(tradingpair.from, tradingpair.to, tradingpair.market, (response) =>{
                        price = response;
                        if(tradingpair.price === null || tradingpair.price === undefined || price !== tradingpair.price){
                        db.updateTradingPair(tradingpair.coin_id, price, (err,msg) =>{
                            if(err){
                                console.log(err)
                            } else {
                                console.log("update 1")
                            }
                        })
                    }

                    })

            });
        }
        


    })

},the_internal);