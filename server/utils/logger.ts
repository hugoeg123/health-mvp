import winston from 'winston';
import 'winston-daily-rotate-file';

// Set default log level based on environment
const LOG_LEVEL = process.env.NODE_ENV === 'development' ? 'debug' : 'info';

// Configure log rotation transport
const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/mvp-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  zippedArchive: true
});

export const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(
      ({ level, message, timestamp, ...metadata }) => {
        let msg = `${timestamp} [${level.toUpperCase()}]: ${message}`;
        if (Object.keys(metadata).length > 0) {
          msg += ` ${JSON.stringify(metadata)}`;
        }
        return msg;
      }
    )
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    fileRotateTransport
  ]
});

// Add error event handler for the rotate transport
fileRotateTransport.on('rotate', function(oldFilename, newFilename) {
  logger.info('Log file rotated', { oldFilename, newFilename });
});