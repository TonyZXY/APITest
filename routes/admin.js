const express = require('express');
const router = express.Router();
const path = require('path');




router.get('/:id',(req,res)=>{
    console.log(req.params.id);
    res.sendFile(path.join('/home/bglnewsdev00/NewsAPI/APITest/dist/AdminWebpageV2'+req.params.id))
});


router.get('/',(req,res)=>{
    console.log('get angular');
    res.sendFile(path.join('/home/bglnewsdev00/NewsAPI/APITest/dist/AdminWebpageV2index.html'))
});



module.exports = router;