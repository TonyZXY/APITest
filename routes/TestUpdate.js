const mongoose = require('mongoose');
const config = require('../config');
const UpdateInfo = require('../module/UpdateInfo');


mongoose.connect(config.database);


function add() {
    let update = {
        name: 'update',
        version: '1.3.0',
        info: 'minor bug fix \n 2018-08-22 \n test for update',
        critical: true
    };

    UpdateInfo.createUpdate(update,(err,res)=>{
        if (err){
            console.log(err);
        } else {
            console.log(res);
        }
    })
}

function update() {
    let update = {
        version:'1.200.0',
        info: 'bug fix, \n UI update \n ',
        critical: true
    };

    UpdateInfo.setUpdate(update,(err,res)=>{
        if (err){
            console.log(err);
        } else {
            console.log(res);
        }
    })
}


update();




// add();