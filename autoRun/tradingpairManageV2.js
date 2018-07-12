const express = require('express');
const router = express.Router();
const db = require('../functions/postgredb')
const notification = require('../functions/notification')
const coinAlgorithm = require('../functions/coinAlgorithm')

module.exports = router;

var minute =0.05
the_internal = minute * 60 * 1000;
setInterval(function(){
    console.log("compare starts");
    db.getIOSDevicesForCompare((err, list)=>{
        if(err){
            console.log(err)
        } else{

            if(list.rows[0]===null || typeof list.rows[0]===undefined){
                console.log("No data in database")
            }
            else{
                list.rows.forEach(row => {
                    if(row.coprice === null || typeof row.coprice === undefined){
                        coinAlgorithm.getPriceFromAPI(row.from, row.to, row.market, (response) =>{
                            if(err){
                                console.log(err)
                            } else{
                                coprice = response
                                db.updateTradingPair(row.coinid, coprice, (err,response) =>{
                                    if(err){
                                        console.log(err)
                                    } else{
                                        comparePrice(row.from, row.to, row.market, row.inprice, coprice, row.isgreater, row.device_token,row.number)
                                    }
                                })
                                
                            }
                        })
                        
                        
                    } else{
                        comparePrice(row.from, row.to, row.market, row.inprice, row.coprice, row.isgreater, row.device_token,row.number)
                    }
                });
            }
        }
       
    })
}, the_internal);

function comparePrice(from, to, market, inPrice, coPrice, operator, deviceId, badgeNumber){
       
        // TODO: Update frequncy of interest
     
        if(operator === 1 && coPrice>inPrice){
            db.addIOSDeviceNumber(deviceId, (err,msg)=>{
                if(err){
                    console.log(err)
                } else {
                    message = "Now, " + from +" is worth "+ coPrice + " "+ to + " on "+ market + ", higher than your expectation of "+ inPrice 
                    // notification.sendAlert(deviceId, badgeNumber+1, message)
                    console.log(deviceId+"      "+(badgeNumber+1)+"       "+message)
                }
            })

        } else if( operator === 2 && coPrice < inPrice){
            db.addIOSDeviceNumber(deviceId, (err,msg)=>{
                if(err){
                    console.log(err)
                } else {
                    message = "Now, " + from +" is worth "+ coPrice + " "+ to + " on "+ market + ", lower than your expectation of "+ inPrice 
                    // notification.sendAlert(deviceId, badgeNumber+1, message)
                    console.log(deviceId+"      "+(badgeNumber+1)+"       "+message)
                }
            })
        } else if( operator === 3 && coPrice >= inPrice){
            db.addIOSDeviceNumber(deviceId, (err,msg)=>{
                if(err){
                    console.log(err)
                } else {
                    message = "Now, " + from +" is worth "+ coPrice + " "+ to + " on "+ market + ", higher or equal to your expectation of "+ inPrice 
                    // notification.sendAlert(deviceId, badgeNumber+1, message)
                    console.log(deviceId+"      "+(badgeNumber+1)+"       "+message)
                }
            })
        } else if( operator ===4 && coPrice <= inPrice){
            db.addIOSDeviceNumber(deviceId, (err,msg)=>{
                if(err){
                    console.log(err)
                } else {
                    message = "Now, " + from +" is worth "+ coPrice + " "+ to + " on "+ market + ", lower or equal to your expectation of "+ inPrice 
                    // notification.sendAlert(deviceId, badgeNumber+1, message)
                    console.log(deviceId+"      "+(badgeNumber+1)+"       "+message)
                }
            })
        }



}
// t