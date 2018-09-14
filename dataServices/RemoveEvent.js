const mongoose = require('mongoose');
const config = require('../config');
const Event = require('../module/Event');

mongoose.connect(config.database, config.options).then(console.log("connected"));


let id = '5b9b36da59c17930493e02f9';

Event.removeEvent(id,(err,msg)=>{
    if (err) {
        console.log(err);
    } else {
        Event.getAllEvent((err,msg2)=>{
            if (err){
                console.log(err);
            } else {
                console.log(msg2);
            }
        })
    }
});