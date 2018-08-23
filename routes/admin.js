const express = require('express');
const router = express.Router();
const path = require('path');


router.get('/:id', (req, res) => {
    res.sendFile(path.join('/home/bglnewsdev00/NewsAPI/APITest/dist/AdminWebpageV2/' + req.params.id))
});


router.get('/', (req, res) => {
    res.sendFile(path.join('/home/bglnewsdev00/NewsAPI/APITest/dist/AdminWebpageV2/index.html'))
});


module.exports = router;