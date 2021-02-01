import 'dotenv/config';
import logger from '@utils/logger';
import { connnectDb } from 'db/core';
import Server, { httpServer } from './server';

logger.info(`Environment ${process.env.NODE_ENV}`);

// This is going to catch all the uncaught errors, for example
// undefined variables
process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT REJECTION', 'Shutting down...');
    logger.error(err);
    // Code: 0 success
    // 1 - uncaught exception
    process.exit(1);
});

// This is going to catch all the unhandled errors on the application
// to avoid the application crash
process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION', 'Shutting down...');
    logger.error(err);
    // Code: 0 success
    // 1 - uncaught exception
    if (httpServer) {
        httpServer.close(() => {
            // Give time to server to complete all pending request!
            process.exit(1);
        });
    } else {
        logger.info('HttpServer no instantiate');
    }
});

const server = new Server();
server.loadMiddlewares().loadContainer().loadRoutes().loadErrorMiddleware();

connnectDb().then(() => {
    server.start((port: number) => {
        logger.info(`The API is already running, on the ${port}`, { port });
    });
});
