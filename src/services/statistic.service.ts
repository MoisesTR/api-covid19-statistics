/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { AddNewCaseDto, AddNewDeathDto, AddNewTestDto } from '@services/dtos/statistic';
import { StatisticDocument } from '@db/documents/statistic';
import { Statistic } from '@common/interfaces/statistic';
import StatisticRepo from '@db/repositories/interfaces/statistic.repo';
import AppError from '@utils/app-error';
import { Types } from 'mongoose';

export default class StatisticService {
    constructor(private readonly statisticRepo: StatisticRepo) {}

    public syncData(data: any[]): Promise<StatisticDocument[]> {
        data.forEach((statistic) => {
            statistic.cases.pop1M = statistic.cases['1M_pop'];
            statistic.cases.newCases = Number(statistic.cases.new?.replace('+', '') || 0);
            statistic.deaths.pop1M = statistic.deaths['1M_pop'];
            statistic.deaths.newCases = Number(statistic.deaths.new?.replace('+', '') || 0);
            statistic.tests.pop1M = statistic.tests['1M_pop'];
        });

        const statistics: Statistic[] = data;
        return this.statisticRepo.syncData(statistics);
    }

    public findAllStatistics(): Promise<StatisticDocument[]> {
        return this.statisticRepo.findAllStatistics();
    }

    public async findStatisticByIdCountry(
        idCountry: Types.ObjectId,
    ): Promise<StatisticDocument | null> {
        const statistic = await this.statisticRepo.findStatisticByIdCountry(idCountry);

        if (!statistic) {
            throw new AppError('The statistic of the requested country was not found', 404);
        }

        return statistic;
    }

    public async addNewCases(addNewCaseDto: AddNewCaseDto): Promise<boolean> {
        const { active, critical, newCases, recovered } = addNewCaseDto;
        if (active || critical || newCases || recovered) {
            const result = this.statisticRepo.addNewCases(addNewCaseDto);
            addNewCaseDto.active = active || 0;
            addNewCaseDto.critical = critical || 0;
            addNewCaseDto.newCases = newCases || 0;
            addNewCaseDto.recovered = recovered || 0;
            return !!result;
        }
        return false;
    }

    public async addNewDeaths(addNewDeathDto: AddNewDeathDto): Promise<boolean> {
        const result = this.statisticRepo.addNewDeaths(addNewDeathDto);
        addNewDeathDto.newCases = addNewDeathDto.newCases || 0;
        return !!result;
    }

    public async addNewTests(addNewTestDto: AddNewTestDto): Promise<boolean> {
        addNewTestDto.newTests = addNewTestDto.newTests || 0;
        const result = await this.statisticRepo.addNewTests(addNewTestDto);
        return !!result;
    }
}
