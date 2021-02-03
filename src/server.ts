import Express from 'express';
import RateLimit from 'express-rate-limit';
import http from 'http';
import logger from '@utils/logger';
import { onError, onListening } from '@utils/error-callbacks';
import ENV from '@environment/environment';
import { loadControllers } from 'awilix-express';
import loadThirdPartyMiddlewares from 'middlewares/thirdparty-middlewares';
import loadErrorMiddleware from 'middlewares/error-middlewares';
import loadCorsConfiguration from 'middlewares/cors';
import { getExtensionModulesDI } from '@utils/utils';
import { loadContainer } from 'container';

const app = Express();
app.enable('trust proxy');
app.set('port', ENV.SERVER_PORT);

const httpServer = new http.Server(app);
httpServer.on('error', onError);
httpServer.on('listening', onListening(httpServer));
httpServer.on('close', () => logger.info('Closing'));

export default class Server {
    constructor() {
        loadCorsConfiguration(app);
    }

    loadMiddlewares(): Server {
        loadThirdPartyMiddlewares(app);
        return this;
    }

    loadContainer(): Server {
        loadContainer(app);
        return this;
    }

    loadRoutes(): Server {
        // Limit Request from same API
        const limiter = RateLimit({
            max: 600, // limit each IP to 600 requests per windowMs
            windowMs: 60 * 60 * 1000, // 60 MINUTES
            message: 'Too many request from this IP, please try again in an hour!',
        });
        app.use('/api', limiter);
        app.use(loadControllers(`controllers/*${getExtensionModulesDI()}`, { cwd: __dirname }));
        return this;
    }

    loadErrorMiddleware(): Server {
        loadErrorMiddleware(app);
        return this;
    }

    // eslint-disable-next-line class-methods-use-this
    start(callback: (port: number) => void): void {
        httpServer.listen(ENV.SERVER_PORT, () => callback(ENV.SERVER_PORT));
        process.on('SIGTERM', () => {
            logger.info('SIGTERM CATCHED: closing server..');
            httpServer.close(() => {
                process.exit(0);
            });
        });
    }
}

export { app, httpServer };
