const express = require('express'); //express
const router = express.Router();    //router to export
const mongoose = require('mongoose');   //mongoose used to connect to mongodb
const jwt = require('jsonwebtoken');
const Coin = require('../module/Coin');
const logger = require('../functions/logger');

const config = require('../config');

mongoose.connect(config.database, config.options);


module.exports = router;



//get all coin list
router.get('/getAll', (req, res) => {
    let address = req.connection.remoteAddress;
    Coin.getCoinList((err, list) => {
        if (err) {
            console.log(err);
            logger.databaseError('coin', address, err);
        } else {
            res.json(list);
        }
    })
});


//get all coin list with specific currency
router.get('/getAllWithCurrency', (req, res) => {
    let currency = req.query.currency;
    let address = req.connection.remoteAddress;
    Coin.getCoinListCurrency(currency, (err, msg) => {
        if (err) {
            console.log(err);
            logger.databaseError('coin', address, err);
        } else {
            res.json(msg);
            logger.coinLog(address, "Get all coins with currency.");
        }
    })
});


// delete coin by name
router.delete('/delete', (req, res) => {
    let name = req.query.name;
    let address = req.connection.remoteAddress;
    Coin.deleteCoinByName(name, (err, msg) => {
        if (err) {
            console.log(err);

            logger.databaseError('coin', address, err);
        } else {
            res.json(msg);
            logger.coinLog(address, "Delete Coin By name.");
        }
    })
});
// const CoinFilter = require('../module/Coinfilter');
const coinfilter = require('../module/coinFliterNew');



//get coin list
router.get('/getCoinList', (req, res) => {
    let address = req.connection.remoteAddress;
    coinfilter.getCoinList((err, coinList) => {
        if (err) {
            console.log(err);
            logger.databaseError('coin', address, err);
        } else {
            res.json(coinList.data);
            logger.coinLog(address, "Get filtered Coin List");

        }
    })
});


// router.delete('/deleteCoin/:_id',(req,res)=>{
//     const id = req.params._id;
//     let address = req.connection.remoteAddress;
//     CoinFilter.deleteCoinById(id, (err,coin)=>{
//         if(err){
//             console.log(err);
//             logger.databaseError('coin',address, err);
//         } else{
//             res.json(coin);
//             logger.coinLog(address,"Delete filtered Coin By id.");
//         }
//     })
// });


// get specific coin data
router.get('/getCoin', (req, res) => {
    let symbol = req.query.coin;
    let address = req.connection.remoteAddress;
    Coin.getOneCoin(symbol, (err, coin) => {
        if (err) {
            console.log(err);
            logger.databaseError('coin', address, err);
        } else {
            res.json(coin);
            logger.coinLog(address, "Get Coin Data " + symbol);
        }
    })
});