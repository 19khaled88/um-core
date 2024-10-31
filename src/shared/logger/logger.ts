import winston from "winston";
import path from 'path';

const successLogger = winston.createLogger({
    level:'info',
    format:winston.format.combine(
        winston.format.timestamp({format:'YYYY-MM-DD HH:mm:ss'}),
        winston.format.json()
    ),
    defaultMeta:{service:'user-service'},
    transports:[
        new winston.transports.Console(),
        new winston.transports.File({filename: path.join(process.cwd(),'logs','winston','success.log'),level:'info'}),
        // new winston.transports.File({filename:'combined.log'}),
    ]
});

const errorLogger = winston.createLogger({
    level:'error',
    format:winston.format.combine(
        winston.format.timestamp({format:'YYYY-MM-DD HH:mm:ss'}),
        winston.format.json()
    ),
    defaultMeta:{service:'user-service'},
    transports:[
        new winston.transports.Console(),
        new winston.transports.File({filename: path.join(process.cwd(),'logs','winston','error.log'),level:'error'}),
        // new winston.transports.File({filename:'combined.log'}),
    ]
});

export {successLogger, errorLogger};