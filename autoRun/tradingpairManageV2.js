const express = require('express');
const router = express.Router();
const db = require('../functions/postgredb');
const notification = require('../functions/notification');
const coinAlgorithm = require('../dataServices/coinAlgorithm');
const logger = require('../functions/logger');

module.exports = router;

let minute = 0.05;
let the_internal = minute * 60 * 1000;
setInterval(function () {
    db.getIOSDevicesForCompare((err, list) => {
        if (err) {
            console.log(err);
            logger.databaseError("TradingpairManage", "server", err);

        } else {
            if (list.rows[0] === null || typeof list.rows[0] === undefined) {
                console.log("No data in database");
                logger.databaseError("TradingpairManage", "db", "No data in database");
            }
            else {
                list.rows.forEach(row => {
                    if (row.coprice === null || typeof row.coprice === undefined) {
                        coinAlgorithm.getPriceFromAPI(row.from, row.to, row.market, (err, response) => {
                            if (err) {
                                console.log(err);
                                logger.APIConnectionError("TradingpairManage", "CryptoCompare", err);
                            } else {
                                let coprice = response;
                                db.updateTradingPair(row.coinid, coprice, (err, response) => {
                                    if (err) {
                                        console.log(err);
                                        logger.databaseError("TradingpairManage", "server", err);
                                    } else {
                                        comparePrice(row.from, row.to, row.market, row.inprice, coprice, row.isgreater, row.device_token, row.number, row.interest_id)
                                    }
                                })
                            }
                        })
                    } else {
                        comparePrice(row.from, row.to, row.market, row.inprice, row.coprice, row.isgreater, row.device_token, row.number, row.interest_id)
                    }
                });
            }
        }
        console.log("Compared once");
        logger.databaseUpdateLog("TradingpairManage", "server", "Trading pair in database has been compared once.")
    })
}, the_internal);

function comparePrice(from, to, market, inPrice, coPrice, operator, deviceId, badgeNumber, interestID) {

    // TODO: Update frequncy of interest

    if (operator === 1 && coPrice > inPrice) {
        db.addIOSDeviceNumber(deviceId, (err, msg) => {
            if (err) {
                console.log(err)
            } else {

                let message = "Now, " + from + " is worth " + coPrice + " " + to + " on " + market + ", higher than your expectation of " + inPrice;
                notification.sendAlert(deviceId, badgeNumber + 1, message);
                console.log(deviceId + "      " + (badgeNumber + 1) + "       " + message);
                db.changeInterestStatus([{
                    id: interestID,
                    status: false
                }], (err, msg) => {
                    if (err) {
                        logger.databaseError("tradingpairManage", 'server', err);
                    }
                })
            }
        })

    } else if (operator === 2 && coPrice < inPrice) {
        db.addIOSDeviceNumber(deviceId, (err, msg) => {
            if (err) {
                console.log(err)
            } else {

                let message = "Now, " + from + " is worth " + coPrice + " " + to + " on " + market + ", lower than your expectation of " + inPrice;
                notification.sendAlert(deviceId, badgeNumber + 1, message);
                console.log(deviceId + "      " + (badgeNumber + 1) + "       " + message);
                db.changeInterestStatus([{
                    id: interestID,
                    status: false
                }], (err, msg) => {
                    if (err) {
                        logger.databaseError("tradingpairManage", 'server', err);
                    }
                })
            }
        })
    } else if (operator === 3 && coPrice >= inPrice) {
        db.addIOSDeviceNumber(deviceId, (err, msg) => {
            if (err) {
                console.log(err)
            } else {

                let message = "Now, " + from + " is worth " + coPrice + " " + to + " on " + market + ", higher or equal to your expectation of " + inPrice;
                notification.sendAlert(deviceId, badgeNumber + 1, message);
                console.log(deviceId + "      " + (badgeNumber + 1) + "       " + message);
                db.changeInterestStatus([{
                    id: interestID,
                    status: false
                }], (err, msg) => {
                    if (err) {
                        logger.databaseError("tradingpairManage", 'server', err);
                    }
                })
            }
        })
    } else if (operator === 4 && coPrice <= inPrice) {
        db.addIOSDeviceNumber(deviceId, (err, msg) => {
            if (err) {
                console.log(err)
            } else {
                let message = "Now, " + from + " is worth " + coPrice + " " + to + " on " + market + ", lower or equal to your expectation of " + inPrice;
                notification.sendAlert(deviceId, badgeNumber + 1, message);
                console.log(deviceId + "      " + (badgeNumber + 1) + "       " + message);
                db.changeInterestStatus([{
                    id: interestID,
                    status: false
                }], (err, msg) => {
                    if (err) {
                        logger.databaseError("tradingpairManage", 'server', err);
                    }
                })
            }
        })
    }


}

// t