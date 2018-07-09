const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Interest = require('../module/CoinInterest');
const TradingPair = require('../module/TradingPair');
const algorithm = require('../functions/coinAlgorithm');
const notification = require('../functions/notification');

mongoose.connect('mongodb://localhost/APITest');

module.exports = router;
var minutespartB = 5;
the_intervalB = minutespartB * 45*1000;
setInterval(function() {
    console.log("this is runing");
    Interest.getInterestWithNotification(function (err, userList){
        if(userList !== null && typeof userList !== 'undefined'){
            userList.forEach(user =>{
                let userInterestList = user.interest;
                userInterestList.forEach(interest =>{
                    if(interest.status){
                        TradingPair.getOneTradingPair(interest.coinFrom, interest.coinTo, interest.market, function(err, tradingpair){
                            if(err){
                                console.log(err)
                            } else{
                                if(!tradingpair){
                                    algorithm.getPriceFromAPI(interest.coinFrom, interest.coinTo, interest.market, function(response){
                                        tradingpair = new TradingPair();
                                        tradingpair.coinFrom = interest.coinFrom;
                                        tradingpair.coinTo = interest.coinTo;
                                        tradingpair.market = interest.market;
                                        tradingpair.price = response;
                                        TradingPair.addTradingPair(tradingpair,function (err, trp) {
                                            if (err) {
                                                console.log(err);
                                            }else{
                                                console.log("Add "+ trp.coinFrom + " "
                                                + trp.coinTo + " "+ trp.market+ " "+ trp.price 
                                                + " to tradingpair schema");
                                                comparePrice(user.userID, interest.isGreater, trp, interest)
                                            }
                                        })
                                    })
                                } else{
                                    comparePrice(user.userID,interest.isGreater, tradingpair, interest);
                                    //compair between the two and if neccessary send notification
                                }
                            }
                        })
                    } else {
                        console.log("This interest has been closed on notification")
                    }

                })
            })
        } else{
            console.log("userlist is not working")
        }
})
}, the_intervalB);



function comparePrice(idofUser,operator, tradepair, interest){
    if(operator === 1 && tradepair.price > interest.price){
        // notification.sendAlertNotification(idofUser, 
        //     "Now, "+ interest.coinFrom +" is worth "+ tradepair.price + " "+ interest.coinTo + " on "+ interest.market +
        //     ", higher than your expectation of "+ interest.price+ " "+ interest.market)
        console.log( "Now, "+idofUser+", "+ interest.coinFrom +" is worth "+ tradepair.price + " "+ interest.coinTo + " on "+ interest.market +
             ", higher than your expectation of "+ interest.price+ " "+ interest.market)
        interest.status = false
        Interest.AddInterest(idofUser,interest, (err, msg) =>{
            if(err){
                console.log(err)

            } else{
                console.log("Sent already")
            }
        })
    } else if(operator === 2 && tradepair.price < interest.price){
        // notification.sendAlertNotification(idofUser, 
        //     "Now, "+ interest.coinFrom +" is worth "+ tradepair.price + " "+ interest.coinTo + " on "+ interest.market +
        //     ", lower than your expectation of "+ interest.price+ " "+ interest.market)
        console.log( "Now, "+idofUser+", "+ interest.coinFrom +" is worth "+ tradepair.price + " "+ interest.coinTo + " on "+ interest.market +
        ", lower than your expectation of "+ interest.price+ " "+ interest.market)
        interest.status = false
        Interest.AddInterest(idofUser,interest, (err, msg) =>{
            if(err){
                console.log(err)

            } else{
                console.log("Sent already")
            }
        })
    } else if(operator===3 && tradepair.price >= interest.price){
        // notification.sendAlertNotification(idofUser, 
        //     "Now, "+ interest.coinFrom +" is worth "+ tradepair.price + " "+ interest.coinTo + " on "+ interest.market +
        //     ", higher or equal to your expectation of "+ interest.price+ " "+ interest.market)
        console.log( "Now, "+idofUser+", "+ interest.coinFrom +" is worth "+ tradepair.price + " "+ interest.coinTo + " on "+ interest.market +
        ", higher or equal to your expectation of "+ interest.price+ " "+ interest.market)
        interest.status = false
        Interest.AddInterest(idofUser,interest, (err, msg) =>{
            if(err){
                console.log(err)

            } else{
                console.log("Sent already")
            }
        })
    } else if(operator ===4 && tradepair.price <= interest.price){
        // notification.sendAlertNotification(idofUser, 
        //     "Now, "+ interest.coinFrom +" is worth "+ tradepair.price + " "+ interest.coinTo + " on "+ interest.market +
        //     ", lower or equal to your expectation of "+ interest.price+ " "+ interest.market)
        console.log( "Now, "+idofUser+", "+ interest.coinFrom +" is worth "+ tradepair.price + " "+ interest.coinTo + " on "+ interest.market +
        ", lower or equal to your expectation of "+ interest.price+ " "+ interest.market)
        interest.status = false
        Interest.AddInterest(idofUser,interest, (err, msg) =>{
            if(err){
                console.log(err)

            } else{
                console.log("Sent already")
            }
        })
    } else{
        console.log("No notification");
    }
}




