const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const cpmpression = require('compression');



app.use(cors());
app.use(cpmpression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const api = require('./routes/api');
const login = require('./routes/login');
const userLogin = require('./routes/userLogin');
const deviceManage = require('./routes/deviceManage');
const coin = require('./routes/coin');
const admin = require('./routes/admin');
const policy = require('./routes/policy');


app.use('/api', api);
app.use('/userLogin', userLogin);
app.use('/login',login);
app.use('/deviceManage',deviceManage);
app.use('/coin',coin);
app.use('/admin',admin);
app.use('/policy',policy);


//nothing
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/routes/homepage.html'));
});

//start application
let port = 3020;
app.listen(port);
console.log(`Running on port ${port}`);
