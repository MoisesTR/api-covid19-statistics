// import { AddNewCaseDto, AddNewDeathDto, AddNewTestDto } from '@db/dtos/statistic';
import { AddNewCaseDto, AddNewDeathDto, AddNewTestDto } from '@services/dtos/statistic';
import { StatisticDocument, StatisticModel } from '@db/documents/statistic';
import { Statistic } from '@common/interfaces/statistic';
import { FilterQuery, Types } from 'mongoose';
import StatisticRepo from '../interfaces/statistic.repo';
import { BaseRepo } from './base-repo.repo';

export default class StatisticRepoImpl
    extends BaseRepo<StatisticDocument>
    implements StatisticRepo {
    constructor(protected readonly statisticModel: StatisticModel) {
        super(statisticModel);
    }

    async syncData(statistics: Statistic[]): Promise<StatisticDocument[]> {
        await this.statisticModel.deleteMany();
        return this.statisticModel.insertMany(statistics);
    }

    findAllStatistics(): Promise<StatisticDocument[]> {
        return this.findAll();
    }

    findStatisticByIdCountry(idCountry: Types.ObjectId): Promise<StatisticDocument | null> {
        return this.findById(idCountry);
    }

    findStatisticByCountryName(countryName: string): Promise<StatisticDocument | null> {
        const filter: FilterQuery<StatisticDocument> = {
            [this.nameOf('country')]: countryName,
        };

        return this.findOneByFilter(filter);
    }

    async addNewCases(addNewCaseDto: AddNewCaseDto): Promise<StatisticDocument | null> {
        const statistic = await this.findStatisticByIdCountry(addNewCaseDto.statisticId);
        const { active, critical, newCases, recovered } = addNewCaseDto;

        if (statistic) {
            statistic.cases.active += active;
            statistic.cases.critical += critical;
            statistic.cases.newCases += newCases;
            statistic.cases.recovered += recovered;

            statistic.cases.total += active + critical + newCases + recovered;

            return statistic.save();
        }

        return null;
    }

    async addNewDeaths(addNewDeathDto: AddNewDeathDto): Promise<StatisticDocument | null> {
        const { statisticId, newCases } = addNewDeathDto;
        const statistic = await this.findStatisticByIdCountry(statisticId);

        if (statistic) {
            statistic.deaths.newCases += newCases;
            statistic.deaths.total += newCases;
            return statistic.save();
        }

        return null;
    }

    async addNewTests(addNewTestDto: AddNewTestDto): Promise<StatisticDocument | null> {
        const statistic = await this.findStatisticByIdCountry(addNewTestDto.statisticId);

        if (statistic) {
            statistic.tests.total += addNewTestDto.newTests;
            return statistic.save();
        }

        return null;
    }
}
