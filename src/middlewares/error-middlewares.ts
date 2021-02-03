/* eslint-disable @typescript-eslint/no-unused-vars */
import Express, { NextFunction } from 'express';
import logger from '@utils/logger';
import AppError from '@utils/app-error';
import { ErrorType } from '@common/constants/error-type';

export default (app: Express.Application): void => {
    app.use((_req: Express.Request, _res: Express.Response, next: NextFunction) => {
        const err = new AppError(ErrorType.NotFound.message, ErrorType.NotFound.status);
        next(err);
    });

    const sendErrorDev = (err: Error | AppError, res: Express.Response) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        res.status(err.status || 500).json({
            message: err.message,
            stack: err.stack,
            error: err,
        });
    };
    // error handler
    app.use(
        (
            err: AppError,
            _req: Express.Request,
            res: Express.Response,
            _next: NextFunction,
        ): void => {
            const isDevelopment = process.env.NODE_ENV !== 'production';
            logger.error(`Errors middleware:`, err, `environment: `, process.env.NODE_ENV);

            const error = { ...err };
            error.message = err.message;

            if (isDevelopment) {
                sendErrorDev(error, res);
            } else if (process.env.NODE_ENV === 'production') {
                if (error.isOperational) {
                    res.status(err.status || 500).json(error);
                } else {
                    error.message = 'Unexpected error has been ocurred.';
                    res.status(err.status || 500).json(error);
                }
            } else {
                throw Error('This is not a valid NODE_ENV');
            }
        },
    );
};
