const express = require('express');
const router = express.Router();
const path = require('path');


router.get('/:id',(req,res)=>{
    res.sendFile(path.join('/home/tonyzheng/Dropbox/WorkSpace/APITest/tradingGame/dist/TradingGame/'+req.params.id));
});

router.get('/',(req,res)=>{
    res.sendFile(path.join('/home/tonyzheng/Dropbox/WorkSpace/APITest/tradingGame/dist/TradingGame/index.html'));
});

module.exports = router;