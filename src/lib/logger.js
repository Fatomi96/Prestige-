import { format, createLogger, transports } from 'winston';
import path from 'path';

const { timestamp, combine, errors, json } = format;

class LoggerManager {
    constructor() {
        this.logger = this.createLoggerInstance();
    }

    createLoggerInstance() {
        return createLogger({
            format: combine(timestamp(), errors({ stack: true }), json()),
            defaultMeta: { service: 'MTN Prestige Airport' },
            transports: [
                new transports.Console(),
                new transports.File({
                    filename: `${this.getLogPath()}/${this.getFormattedDate()}.log`,
                    handleExceptions: true,
                    level: 'debug',
                }),
            ],
        });
    }

    getFormattedDate() {
        const st = new Date();
        return st.getFullYear() + '-' + this.pad(st.getMonth() + 1) + '-' + this.pad(st.getDate());
    }

    pad(n) {
        return n < 10 ? '0' + n.toString(10) : n.toString(10);
    }

    getLogPath() {
        const filePath = path.resolve(process.cwd(), 'logs');
        return process.env.log_location ? process.env.log_location : filePath;
    }
}

export default new LoggerManager().logger;
