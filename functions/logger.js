/*jshint esversion: 6 */
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const consolelog = new transports.Console();
const myFormat = printf(info => {
    return `${info.timestamp} [${info.label}]<${info.address}> ${info.level}: ${info.message}`;
  });


function logIntoFile (filename, levelToSet, labelToSet, addressToLog, messageToLog) {
    const logger = createLogger({
        format: combine(
            label({ label: labelToSet }),
            timestamp(),
            myFormat
          )
    });
    let file = new transports.File({filename: filename});
    logger.add(file);
    logger.add(consolelog);
    logger.log({
        level: levelToSet,
        message: messageToLog,
        address: addressToLog
    });
}

// logIntoFile("err.log","error","logger","here","message");
module.exports.databaseError = (labelToSet, addressToLog, messageToLog) =>{
    logIntoFile("database_error.log","error",labelToSet, addressToLog, messageToLog);
};
module.exports.APIConnectionError = (labelToSet,APIToLog,messageToLog) =>{
    logIntoFile("api_error.log", "error",labelToSet,APIToLog,messageToLog);
};
module.exports.APIUpdateLog = (labelToSet,APIToLog,messageToLog) =>{
    logIntoFile("api_update.log","info",labelToSet,APIToLog,messageToLog);
};
module.exports.databaseUpdateLog = (labelToSet,addressToLog,messageToLog) => {
    logIntoFile("database_update.log", "info", labelToSet,addressToLog,messageToLog)
};