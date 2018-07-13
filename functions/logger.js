const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const consolelog = new transports.Console;
const myFormat = printf(info => {
    return `${info.timestamp} [${info.label}]<${info.address}> ${info.level}: ${info.message}`;
  });

module.exports.logIntoFile = (filename, levelToSet, labelToSet, addressToLog, messageToLog) =>{
    const logger = createLogger({
        format: combine(
            label({ label: labelToSet }),
            timestamp(),
            myFormat
          )
    });
    logger.add(filename);
    logger.add(consolelog);
    logger.log({
        level: levelToSet,
        message: messageToLog,
        address: addressToLog
    })
};