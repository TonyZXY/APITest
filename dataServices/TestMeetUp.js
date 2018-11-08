const https = require('https');
const Event = require('../module/Event');

let url = 'https://api.meetup.com/2/events?key=4e46424491c5b3830231b2ce4ec6c&group_urlname=blockchaincentre&sign=true';

const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.database, config.options).then(console.log("connected"));

let BCC = {
    EventBrite: {
        url:'https://www.eventbriteapi.com/v3/organizers/14851725402/events/?order_by=start_desc&token=VKY7KRN2LTUKG2EAFULE',
        hostPage: 'https://www.eventbrite.com.au/o/the-blockchain-centre-14851725402'
    },
    MeetUp: {
        url: 'https://api.meetup.com/2/events?key=3f563b782f62605237c6a6441286574&group_urlname=The-Crypto-Traders',
        hostPage: 'https://www.meetup.com/en-AU/Crypto Sydney/events'
    },
    logoURL:'https://firebasestorage.googleapis.com/v0/b/email-app-6e8c9.appspot.com/o/EtAylkEN_400x400.png?alt=media&token=3f470971-9486-44e4-ba4e-285b5d4533cf',
    name: 'The Blockchain Centre',

};



function getMeetUp(org) {
    https.get(org.MeetUp.url, (response) => {
        response.on("error", (err) => {
            console.log(err);
        });

        let data = '';

        response.on("data", d => {
            data += d;
        });

        response.on("end", () => {
            let JSONData = JSON.parse(data);
            console.log(JSONData);
            let results = JSONData.results;
            results.forEach(result => {
                let event = new Event();
                event.eventID = result.id;
                event.eventName = result.name;
                event.eventDescription = strip(result.description);
                event.eventURL = result.event_url;
                event.eventStartTime = new Date(result.time + result.utc_offset);
                event.eventEndTime = new Date(result.time + result.utc_offset + result.duration);
                // console.log(result.venue);
                let venue = result.venue;
                if (venue === null || venue === undefined) {
                    event.eventVenue = 'null';
                    event.eventAddress = 'null';
                    event.eventCity = 'null';
                    event.eventLati = null;
                    event.eventLong = null;
                } else {
                    event.eventVenue = result.venue.name;
                    event.eventAddress = result.venue.address_1;
                    event.eventCity = result.venue.city;
                    event.eventLati = result.venue.lat;
                    event.eventLong = result.venue.lon;
                }
                event.eventHost = org.name;
                event.eventHostPage = org.MeetUp.hostPage;
                event.eventCreatedTime = new Date(result.created + result.utc_offset);
                event.eventUpdatedTime = new Date(result.updated + result.utc_offset);
                event.eventImageURL = result.photo_url;
                event.custom = false;
                event.logoURL = org.logoURL;
                console.log(event);
                // Event.addEvent(event, (err, res) => {
                //     if (err) {
                //         console.log(err);
                //     } else {
                //     }
                // });
            });
        });
    });
}


getMeetUp(BCC);

function strip(str) {
    if ((str===null) || (str===''))
        return false;
    else
        str = str.toString();
    return str.replace(/<[^>]*>/g, '');
}