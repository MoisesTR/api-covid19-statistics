import { Types } from 'mongoose';

export interface AddNewCaseDto {
    statisticId: Types.ObjectId;
    active: number;
    critical: number;
    newCases: number;
    recovered: number;
}

export interface AddNewDeathDto {
    statisticId: Types.ObjectId;
    newCases: number;
}

export interface AddNewTestDto {
    statisticId: Types.ObjectId;
    newTests: number;
}
