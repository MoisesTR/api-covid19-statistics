import { Document, Model } from 'mongoose';
import { Case } from '@common/interfaces/case';
import { Death } from '@common/interfaces/death';
import { Test } from '@common/interfaces/test';

export interface StatisticDocument extends Document {
    continent: string;
    country: string;
    population: number;
    cases: Case;
    deaths: Death;
    tests: Test;
    day: Date;
    time: string;
}
export type StatisticModel = Model<StatisticDocument>;
