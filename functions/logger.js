/*jshint esversion: 6 */
const {createLogger, format, transports} = require('winston');
const {combine, timestamp, label, printf} = format;
const consolelog = new transports.Console();
const myFormat = printf(info => {
    return `${info.timestamp} [${info.label}]<${info.address}> ${info.level}: ${info.message}`;
});

const fs = require( 'fs' );
const path = require('path');
const logDir = '/home/tonyzheng/Dropbox/WorkSpace/APITest/log';

if ( !fs.existsSync( logDir ) ) {
    // Create the directory if it does not exist
    fs.mkdirSync( logDir );
}



function logIntoFile(filename, levelToSet, labelToSet, addressToLog, messageToLog) {
    const logger = createLogger({
        format: combine(
            label({label: labelToSet}),
            timestamp(),
            myFormat
        )
    });
    let file = new transports.File({
        filename: path.join(logDir,filename)
    });
    logger.add(file);
    logger.add(consolelog);
    logger.log({
        level: levelToSet,
        message: messageToLog,
        address: addressToLog
    });
}

// logIntoFile("err.log","error","logger","here","message");
module.exports.databaseError = (labelToSet, addressToLog, messageToLog) => {
    logIntoFile("database_error.log", "error", labelToSet, addressToLog, messageToLog);
};
module.exports.APIConnectionError = (labelToSet, APIToLog, messageToLog) => {
    logIntoFile("api_error.log", "error", labelToSet, APIToLog, messageToLog);
};
module.exports.APIUpdateLog = (labelToSet, APIToLog, messageToLog) => {
    logIntoFile("api_update.log", "info", labelToSet, APIToLog, messageToLog);
};
module.exports.databaseUpdateLog = (labelToSet, addressToLog, messageToLog) => {
    logIntoFile("database_update.log", "info", labelToSet, addressToLog, messageToLog);
};
module.exports.userRegistrationLoginLog = (address, messageToLog) => {
    logIntoFile("user_registration_login.log", "info", "userLogin", address, messageToLog);
};
module.exports.newsFlashLog = (address, messageToLog) => {
    logIntoFile("newsflash.log", "info", "api", address, messageToLog);
};
module.exports.deviceManageLog = (address, messageToLog) => {
    logIntoFile("device_management.log", "info", "deviceManage", address, messageToLog);
};
module.exports.adminLoginLog = (address, messageToLog) => {
    logIntoFile("admin_login.log", "info", "login", address, messageToLog);
};
module.exports.coinLog = (address, messageToLog) => {
    logIntoFile("coin_log.log", "info", "coin", address, messageToLog);
};