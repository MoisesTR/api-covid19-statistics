import { Request, Response } from 'express';
import { route, GET } from 'awilix-express';

@route('/')
export default class DefaultController {
    @GET()
    // eslint-disable-next-line class-methods-use-this
    public async index(_req: Request, res: Response): Promise<void> {
        res.send('Running API COVID-19 STATISTICS');
    }
}
