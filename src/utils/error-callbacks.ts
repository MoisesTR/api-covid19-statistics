/* eslint-disable no-fallthrough */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import http from 'http';

import logger from '@utils/logger';
import EnvVar from '@environment/environment';

/**
 * Event listener for HTTP server "listening" event.
 */
export const onListening = (httpServer: http.Server) => (): void => {
    const addr = httpServer.address() || '';
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    logger.debug(`Listening on ${bind}`);
};

/**
 * Event listener for HTTP server "error" event.
 */
export function onError(error: any) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger.error(`${EnvVar.SERVER_PORT} requires elevated privileges`);
            process.exit(1);
        case 'EADDRINUSE':
            logger.error(`${EnvVar.SERVER_PORT} is already in use`);
            process.exit(1);
        default:
            throw error;
    }
}
