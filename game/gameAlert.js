const mongoose = require('mongoose');
const apn = require('apn');
const db = require('../functions/postgredb');
const logger = require('../functions/logger');
const GameCoin = require('./GameCoin');


const config = require('../config');

mongoose.connect(config.database,config.options);

const optionsToFile = {
    token: {
        key: "../cert.p8",
        keyId: "PFYGPR25U8",
        teamId: "4SMWL7L89M"
    },
    production: true
};


function getData() {
    db.gameGetIOSDeviceForNotification((err,dbmsg)=>{
        if (err){
            console.log(err);
        } else {
            console.log(dbmsg.rows);
            if (dbmsg.rows[0]===null || dbmsg.rows[0]===undefined){
                console.log("No data in database");
            } else {
                let list = dbmsg.rows;
                GameCoin.getCoinList((err,momsg)=>{
                    if (err){
                        console.log(err)
                    } else {
                        list.forEach( item =>{
                            let coin = momsg.find( co => co.coin_name === item.coin_name);
                            compare(item,coin);
                        })
                    }
                });
            }
        }
    })
}

function compare(interest, coin) {
    if(interest.isgreater === 1 && coin.current_price > interest.price){
        let message = 'Now, '+interest.coin_name+' is worth '+coin.current_price+', higher than your expectation of '+interest.price;
        sendAlert(interest.device_token,message);
        interest.status = false;
        db.gameUpdateAlertStatus([interest],(err,dbmsg)=>{
            if (err){
                console.log(err);
            } else {
            }
        })
    }else if (interest.isgreater === 2 && coin.current_price < interest.price){
        let message = 'Now, '+interest.coin_name+' is worth '+coin.current_price+', lower than your expectation of '+interest.price;
        sendAlert(interest.device_token,message);
        interest.status = false;
        db.gameUpdateAlertStatus([interest],(err,dbmsg)=>{
            if (err){
                console.log(err);
            } else {
            }
        })
    }else if (interest.isgreater === 3 && coin.current_price >= interest.price ){
        let message = 'Now, '+interest.coin_name+' is worth '+coin.current_price+', higher than or equal your expectation of '+interest.price;
        sendAlert(interest.device_token,message);
        interest.status = false;
        db.gameUpdateAlertStatus([interest],(err,dbmsg)=>{
            if (err){
                console.log(err);
            } else {
            }
        })
    } else if (interest.isgreater === 4 && coin.current_price <=interest.price){
        let message = 'Now, '+interest.coin_name+' is worth '+coin.current_price+', lower than or equal your expectation of '+interest.price;
        sendAlert(interest.device_token,message);
        interest.status = false;
        db.gameUpdateAlertStatus([interest],(err,dbmsg)=>{
            if (err){
                console.log(err);
            } else {
            }
        })
    }
}




function sendAlert(deviceID, message){
    let apnProvider = new apn.Provider(optionsToFile);
    let notification = new apn.Notification();
    notification.badge = 0;
    notification.title = "Trading Game Price Alert";
    notification.body = message;
    notification.sound = 'default';
    notification.topic = "com.blockchainglobal.bglmedia";
    apnProvider.send(notification,deviceID).then( res =>{
        console.log(res);
        res.failed.forEach(f=>{

        })
    })
}



const delay = amount => {
    return new Promise(resolve => {
        setTimeout(resolve, amount);
    });
};


function loginConsole(msg) {
    console.log(
        new Date(Date.now()).toLocaleString() + " " + msg
    );
}


async function runScript() {
    let time = 1;
    do {
        getData();
        loginConsole("Check Game Alert Loop for "+time+" times.");
        time++;
        await delay(1000*60);
    }while (true)
}


module.exports.run = () =>{
    runScript();
};


module.exports.runOneTime = () =>{
    getData();
};