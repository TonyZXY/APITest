const express = require('express');
const router = express.Router();
const path = require('path');


// this file serve main.css file to every static page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/main.css'));
});


module.exports = router;