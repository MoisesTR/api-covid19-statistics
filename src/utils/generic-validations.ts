import { NextFunction, Request, Response } from 'express';
import { param, validationResult } from 'express-validator';
import { Types } from 'mongoose';

export const isObjectId = (value: string | number | Types.ObjectId | undefined): Types.ObjectId => {
    try {
        return new Types.ObjectId(value);
    } catch (_e) {
        throw new Error('Invalid document id');
    }
};

export function validParams(req: Request, res: Response, next: NextFunction): void {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        next();
    } else {
        res.status(400).json(errors.mapped());
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const modelIdIsObjectId = (paramName: string) =>
    param(paramName, 'Invalid document id').notEmpty().bail().custom(isObjectId);

export const getMessageMinMaxChar = (obj: string, min: number, max: number): string => {
    return `${obj} must be between ${min} and ${max} characters long!`;
};
