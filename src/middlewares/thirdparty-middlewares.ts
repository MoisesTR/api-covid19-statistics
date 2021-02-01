import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import logger from '@utils/logger';
// Preventing basic attacks
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

const loggerstream = {
    write(message: string) {
        logger.info(message);
    },
};

export default (app: express.Application): void => {
    app.use(cookieParser());
    app.use(morgan('combined', { stream: loggerstream }));
    // Data sanitization against noSQL query injection
    app.use(mongoSanitize());
    app.use(helmet({}));
    // Body parser, reading data from body into req.body
    app.use(express.json({ limit: '20kb' }));
    app.use(express.urlencoded({ extended: true }));
};
