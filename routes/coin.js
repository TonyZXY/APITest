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


mongoose.connect('mongodb://localhost/APITest',options);


module.exports = router;


router.get('/getAll',(req,res)=>{
    let address = req.connection.remoteAddress;
    Coin.getCoinList((err,list)=>{
        if (err) {
            console.log(err);
            logger.databaseError('coin',address, err);
        } else {
            res.json(list);
        }
    })
});

router.get('/getAllWithCurrency',(req,res)=>{
    let currency = req.query.currency;
    let address = req.connection.remoteAddress;
    console.log(currency);
    Coin.getCoinListCurrency(currency,(err,msg)=>{
        if (err) {
            console.log(err);
            logger.databaseError('coin',address, err);
        } else {
            res.json(msg);
            logger.coinLog(address,"Get all coins with currency.");
        }
    })
});

router.delete('/delete',(req,res)=>{
    let name = req.query.name;
    let address = req.connection.remoteAddress;
    Coin.deleteCoinByName(name,(err,msg)=>{
        if (err) {
            console.log(err);
            
            logger.databaseError('coin',address, err);
        }else {
            res.json(msg);
            logger.coinLog(address,"Delete Coin By name.");
        }
    })
});
const CoinFilter = require('../module/Coinfilter');

router.get('/getCoinList',(req,res)=>{
    let address = req.connection.remoteAddress;
    CoinFilter.getCoinList((err,coinList)=>{
        if(err){
            console.log(err);
            logger.databaseError('coin',address, err);
        } else{
            res.json(coinList);
            logger.coinLog(address,"Get filtered Coin List");

        }
    })
});
router.delete('/deleteCoin/:_id',(req,res)=>{
    const id = req.params._id;
    let address = req.connection.remoteAddress;
    CoinFilter.deleteCoinById(id, (err,coin)=>{
        console.log(id);
        if(err){
            console.log(err);
            logger.databaseError('coin',address, err);
        } else{
            res.json(coin);
            logger.coinLog(address,"Delete filtered Coin By id.");
        }
    })
});