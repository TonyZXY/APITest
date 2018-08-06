const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cpmpression = require('compression');

app.use(cors());
app.use(cpmpression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname+'/dist/AdminWebpageV2'));

const api = require('./routes/api');
const login = require('./routes/login');
const userLogin = require('./routes/userLogin');
const deviceManage = require('./routes/deviceManage');
const coin = require('./routes/coin');
const admin = require('./routes/admin');

app.use('/api', api);
app.use('/userLogin', userLogin);
app.use('/login',login);
app.use('/deviceManage',deviceManage);
app.use('/coin',coin);
app.use('/admin',admin);


//nothing
app.get('/', function (req, res) {
    res.send('helloworld');
});

//start application
let port = 3020;
app.listen(port);
console.log(`Running on port ${port}`);
