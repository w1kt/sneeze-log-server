import winston from "winston";
require("winston-daily-rotate-file");

const transport = new winston.transports.DailyRotateFile({
  filename: "loggable-api-%DATE%.log",
  datePattern: "YYYY",
  maxSize: "20m",
  maxFiles: "3",
  zippedArchive: true,
});

const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
  level: "verbose",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    json()
  ),
  transports: [transport],
});

export default logger;
