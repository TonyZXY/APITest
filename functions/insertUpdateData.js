const Update = require('../module/UpdateInfo');
const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.database, config.options);


function add() {
    let update = {
        name: 'update',
        version: '1.1(1)',
        info: 'minor bug fix',
        critical: false
    };

    Update.createUpdate(update,(err,msg)=>{
        if (err){
            console.log(err);
        } else {
            console.log(msg);
        }
    })
}


add();