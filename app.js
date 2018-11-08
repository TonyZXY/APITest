const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cpmpression = require('compression');

app.use(cors());
app.use(cpmpression());
app.use(bodyParser.json({limit:'50mb',extended: true}));
app.use(bodyParser.urlencoded({limit:'50mb', extended: true }));

const api = require('./routes/api');
const login = require('./routes/login');
const userLogin = require('./routes/userLogin');
const deviceManage = require('./routes/deviceManage');
const coin = require('./routes/coin');
const admin = require('./routes/admin');
const policy = require('./routes/policy');
const game = require('./routes/game');
const tradingGamePage = require('./routes/tradingGame');

app.use('/api', api);
app.use('/userLogin', userLogin);
app.use('/login',login);
app.use('/deviceManage',deviceManage);
app.use('/coin',coin);
app.use('/admin',admin);
app.use('/policy',policy);
app.use('/game',game);
app.use('/trading',tradingGamePage);



//nothing
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/homepage.html'));
});

//start application
let port = 3020;
app.listen(port);
console.log(`Running on port ${port}`);
