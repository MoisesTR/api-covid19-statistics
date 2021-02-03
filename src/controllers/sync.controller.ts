/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { route, GET, before } from 'awilix-express';
import axios from 'axios';
import StatisticService from '@services/statistic.service';
import { ensureAuth } from '@services/jwt';

const options: any = {
    method: 'GET',
    url: 'https://covid-193.p.rapidapi.com/statistics',
    headers: {
        'x-rapidapi-key': 'ad17777c28msh52f81ecf12744bdp111a6bjsn2c9fe32bd0e4',
        'x-rapidapi-host': 'covid-193.p.rapidapi.com',
    },
};

@before([ensureAuth])
@route('/sync')
export default class SyncController {
    constructor(private readonly statisticService: StatisticService) {}

    @GET()
    public async syncData(_req: Request, res: Response): Promise<void> {
        const response = await axios.request(options);
        const data: any[] = response.data.response;
        const statistics = await this.statisticService.syncData(data);
        res.send(statistics);
    }
}
