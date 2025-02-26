import { format, loggers, transports } from 'winston';
const { combine, timestamp, json, errors } = format;

loggers.add('Error', {
    level: process.env.LOG_LEVEL || 'info',
    format: combine(errors({ stack: true }), timestamp(), json()),
    transports: [new transports.File({ filename: './logs/error-logs.log' })],
    defaultMeta: { service: 'ErrorService' },
});

loggers.add('Login', {
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp(), json()),
    transports: [new transports.File({ filename: './logs/request-logs.log' })],
    defaultMeta: { service: 'LoginService' },
});
