import { AddNewCaseDto, AddNewDeathDto, AddNewTestDto } from '@services/dtos/statistic';
import { Statistic } from '@common/interfaces/statistic';
import { Types } from 'mongoose';
import { StatisticDocument } from '@db/documents/statistic';

export default interface StatisticRepo {
    syncData(statistics: Statistic[]): Promise<StatisticDocument[]>;
    findAllStatistics(): Promise<StatisticDocument[]>;
    findStatisticByIdCountry(idCountry: Types.ObjectId): Promise<StatisticDocument | null>;
    addNewCases(addNewCaseDto: AddNewCaseDto): Promise<StatisticDocument | null>;
    addNewDeaths(addNewDeathDto: AddNewDeathDto): Promise<StatisticDocument | null>;
    addNewTests(addNewTestDto: AddNewTestDto): Promise<StatisticDocument | null>;
}
