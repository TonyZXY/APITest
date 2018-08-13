const express = require('express');
const router = express.Router();
const path = require('path');


router.get('/:id',(req,res)=>{
    console.log(req.params.id);
    res.sendFile(path.join('/Users/tonyzheng/Dropbox/WorkSpace/APITest/admin/admin/'+req.params.id))
});


router.get('/',(req,res)=>{
    res.sendFile(path.join('/Users/tonyzheng/Dropbox/WorkSpace/APITest/admin/admin/index.html'))
});



module.exports = router;