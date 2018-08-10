const express = require('express');
const router = express.Router();
const path = require('path');




router.get('/admin/:id',(req,res)=>{
    res.sendFile(path.join('/home/bglnewsdev00/NewsAPI/APITest/admin/admin/'+req.params.id))
});


router.get('/',(req,res)=>{
    res.sendFile(path.join('/home/bglnewsdev00/NewsAPI/APITest/admin/admin/index.html'))
});



module.exports = router;