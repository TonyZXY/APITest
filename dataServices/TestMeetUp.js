const https = require('https');
const Event = require('../module/Event');

let url = 'https://api.meetup.com/2/events?key=4e46424491c5b3830231b2ce4ec6c&group_urlname=blockchaincentre&sign=true';

const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.database, config.options).then(console.log("connected"));

https.get(url, (res)=>{
    res.on("error", (err)=>{
        console.log(err);
    });

    let data = '';

    res.on("data", d=>{
        data += d;
    });

    res.on("end", () =>{
        let JSONData = JSON.parse(data);

        // console.log(JSONData.meta);
        // console.log(JSONData.results);
        let results = JSONData.results;
        let result = results[2];
        // console.log(results[0]);
        // console.log(JSON.stringify(result));
        let event = new Event();
        event.eventID = result.id;
        event.eventName = result.name;
        event.eventDescription = strip(result.description);
        event.eventURL = result.event_url;
        event.eventStartTime = new Date(result.time + result.utc_offset);
        event.eventEndTime = new Date(result.time + result.utc_offset + result.duration);
        event.eventVenue = result.venue.name;
        event.eventAddress = result.venue.address_1;
        event.eventCity = result.venue.city;
        event.eventHost = 'The Blockchain Centre';
        event.eventHostPage = 'https://www.meetup.com/en-AU/blockchaincentre/';
        event.eventCreatedTime = new Date(result.created + result.utc_offset);
        event.eventUpdatedTime = new Date(result.updated + result.utc_offset);
        event.eventImageURL = result.photo_url;
        event.eventLati = result.venue.lat;
        event.eventLong = result.venue.lon;

        // console.log(result);
        Event.addEvent(event,(err,res)=>{
            if (err) {
                console.log(err);
            } else {
                Event.getAllEvent((err,msg)=>{
                    if (err){
                        console.log(err);
                    } else {
                        console.log(msg);
                    }
                })
            }
        });
        // console.log(event);
    })
});


function strip(str) {
    if ((str===null) || (str===''))
        return false;
    else
        str = str.toString();
    return str.replace(/<[^>]*>/g, '');
}