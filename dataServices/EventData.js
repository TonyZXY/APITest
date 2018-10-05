const https = require('https');
const mongoose = require('mongoose');
const Event = require('../module/Event');
const config = require('../config');


mongoose.connect(config.database, config.options);


let meetUpUrl = 'https://api.meetup.com/2/events?key=4e46424491c5b3830231b2ce4ec6c&group_urlname=';

let BCC = {
    EventBrite: {
        url:'https://www.eventbriteapi.com/v3/organizers/14851725402/events/?order_by=start_desc&token=VKY7KRN2LTUKG2EAFULE',
        hostPage: 'https://www.eventbrite.com.au/o/the-blockchain-centre-14851725402'
    },
    MeetUp: {
        url: 'https://api.meetup.com/2/events?key=4e46424491c5b3830231b2ce4ec6c&group_urlname=blockchaincentre',
        hostPage: 'https://www.meetup.com/en-AU/blockchaincentre/'
    },
    name: 'The Blockchain Centre',

};

let SBCC = {
    MeetUp: {
        url:'https://api.meetup.com/2/events?key=4e46424491c5b3830231b2ce4ec6c&group_urlname=Sydney-Blockchain-Centre',
        hostPage: 'https://www.meetup.com/Sydney-Blockchain-Centre/'
    },
    name: 'Sydney Blockchain Centre'
};


let Leg = {
    EventBrite:{
        url:'https://www.eventbriteapi.com/v3/organizers/17897843003/events/?order_by=start_desc&token=VKY7KRN2LTUKG2EAFULE',
        hostPage:'https://www.eventbrite.com/o/merklize-ledgerium-17897843003'
    },
    name: "Merklize, Ledgerium"
};


function strip(str) {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();
    return str.replace(/<[^>]*>/g, '');
}

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
            let results = JSONData.results;
            results.forEach(result => {
                let event = new Event();
                event.eventID = result.id;
                event.eventName = result.name;
                event.eventDescription = strip(result.description);
                event.eventURL = result.event_url;
                event.eventStartTime = new Date(result.time);
                event.eventEndTime = new Date(result.time + result.duration);
                let venue = result.venue;
                if (venue === null || venue === undefined) {
                    event.eventVenue = 'null';
                    event.eventAddress = 'null';
                    event.eventCity = 'null';
                    event.eventLati = null;
                    event.eventlong = null;
                } else {
                    event.eventVenue = result.venue.name;
                    event.eventAddress = result.venue.address_1;
                    event.eventCity = result.venue.city;
                    event.eventLati = result.venue.lat;
                    event.eventLong = result.venue.lon;
                }
                event.eventHost = org.name;
                event.eventHostPage = org.MeetUp.hostPage;
                event.eventCreatedTime = new Date(result.created);
                event.eventUpdatedTime = new Date(result.updated);
                event.eventImageURL = result.photo_url;
                event.custom = false;

                Event.addEvent(event, (err, res) => {
                    if (err) {
                        console.log(err);
                    } else {
                    }
                });
            });
        });
    });
}

function getEventBrite(org) {
    https.get(org.EventBrite.url, (response) => {
        response.on("error", (err) => {
            console.log(err);
        });

        let data = '';
        response.on("data", d => {
            data += d;
        });

        response.on("end", () => {
            let JSONData = JSON.parse(data);
            let results = JSONData.events;
            results.forEach(result => {
                let event = new Event();
                event.eventID = result.id;
                event.eventName = result.name.text;
                event.eventDescription = result.description.text;
                event.eventURL = result.url;
                event.eventStartTime = new Date(result.start.utc);
                event.eventEndTime = new Date(result.end.utc);
                event.eventCreatedTime = new Date(result.created);
                event.eventUpdatedTime = new Date(result.changed);
                event.eventImageURL = result.logo.original.url;
                event.eventHost = org.name;
                event.eventHostPage = org.EventBrite.hostPage;
                event.custom = false;
                https.get('https://www.eventbriteapi.com/v3/venues/' + result.venue_id + '/?token=VKY7KRN2LTUKG2EAFULE', (response) => {
                    response.on("error", (err) => {
                        console.log(err);
                    });

                    let data2 = '';
                    response.on("data", d => {
                        data2 += d;
                    });

                    response.on("end", () => {
                        let JS = JSON.parse(data2);
                        event.eventVenue = JS.name;
                        event.eventAddress = JS.address.address_1;
                        event.eventCity = JS.address.city;
                        event.eventLati = JS.address.latitude;
                        event.eventLong = JS.address.longitude;
                        Event.addEvent(event, (err, msg) => {
                            if (err) {
                                console.log(err);
                            } else {
                            }
                        });
                    });
                });
            });
        });
    });
}


function getEvents(org) {
    if (org.EventBrite === null|| org.EventBrite === undefined) {
    } else {
        getEventBrite(org);
    }
    if (org.MeetUp === null || org.MeetUp === undefined) {
    } else {
        getMeetUp(org);
    }
}

async function runGetEvent() {
    let orgs = [BCC,SBCC,MELE];

    orgs.forEach(org => {
        getEvents(org);
    })
}

const delay = amount => {
    return new Promise(resolve => {
        setTimeout(resolve, amount);
    });
};

async function runScript() {
    do {
        runGetEvent();
        await delay(3600 * 1000);
    } while (true)
}

module.exports.run = () => {
    runScript();
};
