const TradingPair = require('../module/TradingPair');
const algorithm = require('../functions/coinAlgorithm');


var minutes = 2;
the_interval = minutes * 60*1000;
setInterval(function() {
  console.log("Check for update");
  TradingPair.getTradingPairList( function (err,tradingpairList){
    if(err){
        console.log(err)
    } else{
        if(typeof tradingpairList !=='undefined' && tradingpairList.length>0){
            tradingpairList.forEach(trpair => {
                let _id = trpair._id;
                algorithm.getPriceFromAPI(trpair.coinFrom, trpair.coinTo, trpair.market,function(response){
                    trpair.price = response;
                    TradingPair.updateTradingPair(_id, trpair, {}, function(err, res){
                        if(err){
                            console.log(err);
                        } else{
                            console.log("This "+ trpair._id+ "is updated")
                        }
                    })
                })
            });
        }
    }
})

}, the_interval);