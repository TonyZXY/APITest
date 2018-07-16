const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Coin = require('../module/Coin');
const logger = require('../functions/logger')

const options = {
    user: 'bglappdev100',
    pass: "appdevgkV6="
};


mongoose.connect('mongodb://localhost/APITest');


module.exports = router;


router.get('/getAll',(req,res)=>{
    Coin.getCoinList((err,list)=>{
        if (err) {
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('coin',address, err);
        } else {
            res.json(list);
        }
    })
});

router.get('/getAllWithCurrency',(req,res)=>{
    let currency = req.query.currency;
    console.log(currency);
    Coin.getCoinListCurrency(currency,(err,msg)=>{
        if (err) {
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('coin',address, err);
        } else {
            res.json(msg);
        }
    })
});

router.delete('/delete',(req,res)=>{
    let name = req.query.name;
    Coin.deleteCoinByName(name,(err,msg)=>{
        if (err) {
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('coin',address, err);
        }else {
            res.json(msg);
        }
    })
});
const CoinFilter = require('../module/Coinfilter');
const coinAlgrithm = require('../functions/coinAlgorithm');
coinAlgrithm.compareTwoAPI();
router.get('/getCoinList',(req,res)=>{
    CoinFilter.getCoinList((err,coinList)=>{
        if(err){
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('coin',address, err);
        } else{
            console.log(coinList.length);
            res.json(coinList)
        }
    })
});
router.delete('/deleteCoin/:_id',(req,res)=>{
    const id = req.params._id;
    CoinFilter.deleteCoinById(id, (err,coin)=>{
        console.log(id);
        if(err){
            console.log(err);
            let address = req.connection.remoteAddress;
            logger.databaseError('coin',address, err);
        } else{
            res.json(coin)
        }
    })
});