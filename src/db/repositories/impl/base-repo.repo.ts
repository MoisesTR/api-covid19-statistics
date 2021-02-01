/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Document, FilterQuery, Model, Types } from 'mongoose';
import nameOfFactory from '@common/name-of-factory';

export abstract class BaseRepo<T extends Document> {
    protected readonly Model: Model<T>;

    protected readonly nameOf = nameOfFactory<T>();

    protected constructor(model: Model<T>) {
        this.Model = model;
    }

    protected async findById(id: Types.ObjectId): Promise<T | null> {
        return this.Model.findById(id);
    }

    protected async findOneByFilter(filter: FilterQuery<T>): Promise<T | null> {
        return this.Model.findOne(filter);
    }

    protected async findAll(): Promise<Array<T>> {
        return this.Model.find();
    }

    protected async findAllByFilter(filter: FilterQuery<T>): Promise<T[]> {
        return this.Model.find(filter);
    }

    protected async create<E>(data: E): Promise<T> {
        const instance = new this.Model(data);
        return instance.save();
    }
}
