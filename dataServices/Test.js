var express = require('express')
var app = express()
const request = require('request');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.get('api/query/:params', function (req, res) {
    //secret read local file
    var secret = "222222";
    //recive params
    var account = "";
    var issuer = "";
    var value = "";
    var Destination = "";
    var currency = "";

    // let username = process.argv.length < 2 ? "default-username" : process.argv[2];
    // let password = process.argv.length < 3 ? "default-password" : process.argv[3];

    let options = {
        url: "",
        method: "post",
        headers:
            {
                "content-type": "text/plain"
            },
        /*
        auth: {
            user: username,
            pass: password
        },
        */
        body: JSON.stringify({
            "method": "sign",
            "params": [
                {
                    "offline": true,
                    "secret": secret,
                    "tx_json": {
                        "Account": account,
                        "Amount": {
                            "currency": currency,
                            "issuer": issuer,
                            "value": value

                        },
                        "Destination": Destination,
                        "TransactionType": "Payment"
                    },

                    "fee_mult_max": 1000
                }
            ]

        })
    };

    //
    // await msg = async request();
    // res.send(msg);
    request(options, (error, response, body) => { //callback || promise

        if (error) {
            console.error('An error has occurred: ', error);
        } else {
            console.log('Post successful: response: ', body);
            let msg = response.get();
            res.send(msg);
        }
    });


    res.send(request.response.get(tx_blob));
})