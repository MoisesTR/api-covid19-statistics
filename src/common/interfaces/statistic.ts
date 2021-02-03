import { Case } from './case';
import { Death } from './death';
import { Test } from './test';

export interface Statistic {
    continent: string;
    country: string;
    population: number;
    cases: Case;
    deaths: Death;
    tests: Test;
    day: Date;
    time: string;
}
