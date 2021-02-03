import { Request, Response } from 'express';
import { route, GET, before, POST } from 'awilix-express';
import StatisticService from '@services/statistic.service';
import { modelIdIsObjectId, validParams } from '@utils/generic-validations';
import { Types } from 'mongoose';
import { AddNewCaseDto, AddNewDeathDto, AddNewTestDto } from '@services/dtos/statistic';
import { matchedData } from 'express-validator';
import {
    addNewCasesValidator,
    addNewDeathsValidator,
    addNewTestsValidator,
} from '@services/validations/validations/statistic.validation';
import { ensureAuth } from '@services/jwt';

const showMessageUpdate = (result: boolean) =>
    result ? 'The data has been updated' : 'The data was not updated';

@before([ensureAuth])
@route('/statistics')
export default class StatisticController {
    constructor(private readonly statisticService: StatisticService) {}

    @GET()
    public async findAllStatistics(_req: Request, res: Response): Promise<void> {
        const statistics = await this.statisticService.findAllStatistics();
        res.send(statistics);
    }

    @before([modelIdIsObjectId('idCountry'), validParams])
    @route('/:idCountry')
    @GET()
    public async findStatisticByIdCountry(req: Request, res: Response): Promise<void> {
        const idCountry = new Types.ObjectId(req.params.idCountry);
        const statistic = await this.statisticService.findStatisticByIdCountry(idCountry);
        res.send(statistic);
    }

    @before([validParams])
    @route('/country-name/:countryName')
    @GET()
    public async findStatisticByCountryName(req: Request, res: Response): Promise<void> {
        const { countryName } = req.params;
        const statistic = await this.statisticService.findStatisticByCountryName(countryName);
        res.send(statistic);
    }

    @before([modelIdIsObjectId('statisticId'), addNewCasesValidator, validParams])
    @route('/new-cases/:statisticId')
    @POST()
    public async addNewCases(req: Request, res: Response): Promise<void> {
        const data = matchedData(req, {
            locations: ['body', 'query', 'params'],
        }) as AddNewCaseDto;
        const isCasesUpdated = await this.statisticService.addNewCases(data);
        res.send({ message: showMessageUpdate(isCasesUpdated) });
    }

    @before([modelIdIsObjectId('statisticId'), addNewDeathsValidator, validParams])
    @route('/new-deaths/:statisticId')
    @POST()
    public async addNewDeaths(req: Request, res: Response): Promise<void> {
        const data = matchedData(req, {
            locations: ['body', 'query', 'params'],
        }) as AddNewDeathDto;
        const isDeathsUpdated = await this.statisticService.addNewDeaths(data);
        res.send({ message: showMessageUpdate(isDeathsUpdated) });
    }

    @before([modelIdIsObjectId('statisticId'), addNewTestsValidator, validParams])
    @route('/new-tests/:statisticId')
    @POST()
    public async addNewTests(req: Request, res: Response): Promise<void> {
        const data = matchedData(req, {
            locations: ['body', 'query', 'params'],
        }) as AddNewTestDto;
        const isTestsUpdated = await this.statisticService.addNewTests(data);

        res.send({ message: showMessageUpdate(isTestsUpdated) });
    }
}
