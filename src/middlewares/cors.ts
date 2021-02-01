import Express, { NextFunction } from 'express';
import cors from 'cors';
import ENV from '@environment/environment';

export default (app: Express.Application): void => {
    app.use(
        cors({
            origin: ENV.ALLOWED_ORIGIN,
            credentials: true,
        }),
    );
    // Configuracion cabeceras y cors
    app.use((_req: Express.Request, res: Express.Response, next: NextFunction) => {
        res.header('Access-Control-Allow-Origin', ENV.ALLOWED_ORIGIN);
        res.header(
            'Access-Control-Allow-Headers',
            'Authorization, X-API-KEY, Origin, ' +
                'X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method',
        );
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
        next();
    });
};
