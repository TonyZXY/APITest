const mongoose = require('mongoose');


// file that store event schema and functions that read and write data into mongodb

const eventSchema = mongoose.Schema({
    eventID:String,
    eventName:String,
    eventDescription:String,
    eventURL:String,
    eventStartTime:Date,
    eventEndTime:Date,
    eventVenue:String,
    eventAddress:String,
    eventCity:String,
    eventHost:String,
    eventHostPage:String,
    eventCreatedTime:Date,
    eventUpdatedTime:Date,
    eventImageURL:String,
    eventLati:Number,
    eventLong:Number,
    custom:Boolean,
    logoURL:String
});

const Event = module.exports = mongoose.model('Event',eventSchema);

module.exports.getEventList = (host,callback)=>{
    Event.find({
        eventHost: host
    },callback)
};

module.exports.addEvent = (event,callback)=>{
    let update = {
        eventID:event.eventID,
        eventName:event.eventName,
        eventDescription:event.eventDescription,
        eventURL:event.eventURL,
        eventStartTime:event.eventStartTime,
        eventEndTime:event.eventEndTime,
        eventVenue:event.eventVenue,
        eventAddress:event.eventAddress,
        eventCity:event.eventCity,
        eventHost:event.eventHost,
        eventHostPage:event.eventHostPage,
        eventCreatedTime:event.eventCreatedTime,
        eventUpdatedTime:event.eventUpdatedTime,
        eventImageURL:event.eventImageURL,
        eventLati:event.eventLati,
        eventLong:event.eventLong,
        custom: event.custom,
        logoURL:event.logoURL
    };

    Event.findOneAndUpdate({
        eventID:event.eventID
    },update,{upsert:true,returnNewDocument:true},callback);
};

// module.exports.addEvent = (event,callback)=>{
//     Event.create(event,callback);
// };

// get data from now and 91 days after
module.exports.getAllEvent = (callback)=>{
    let dateNow = new Date();
    let dateTo = new Date();
    // dateNow.setDate(dateNow.getDate()-1);
    dateTo.setDate(dateTo.getDate()+91);
    Event.find({
        "eventStartTime":{
            "$gte":dateNow,
            "$lt":dateTo
        }
    },callback);
};

module.exports.removeEvent = (id,callback)=>{
    Event.remove({_id:id},callback);
};


module.exports.getOneEvent = (ID,callback)=>{
    Event.findOne({eventID:ID},callback);
};