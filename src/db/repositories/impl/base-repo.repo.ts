import { Document, FilterQuery, Model, Types } from 'mongoose';
import nameOfFactory from '@common/name-of-factory';

export abstract class BaseRepo<T extends Document> {
    protected readonly Model: Model<T>;

    protected readonly nameOf = nameOfFactory<T>();

    protected constructor(model: Model<T>) {
        this.Model = model;
    }

    protected async findById(id: Types.ObjectId): Promise<T | null> {
        const document = await this.Model.findById(id);
        return document;
    }

    protected async findOneByFilter(filter: FilterQuery<T>): Promise<T | null> {
        const document = await this.Model.findOne(filter);
        return document;
    }

    protected async findAll(): Promise<T[]> {
        const documents = await this.Model.find();
        return documents;
    }

    protected async create(data: Partial<T>): Promise<T> {
        const instance = new this.Model(data);
        return instance.save();
    }
}
