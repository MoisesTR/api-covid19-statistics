import { ModelNames } from 'db/enums/model-names.enum';
import { StatisticDocument } from '@db/documents/statistic';
import { model, Schema } from 'mongoose';

const statisticSchema = new Schema<StatisticDocument>(
    {
        continent: {
            type: String,
        },
        country: {
            type: String,
            unique: true,
            index: true,
        },
        population: {
            type: Number,
        },
        cases: {
            pop1M: String,
            active: Number,
            critical: Number,
            newCases: Number,
            recovered: Number,
            total: Number,
        },
        deaths: {
            pop1M: String,
            newCases: Number,
            total: Number,
        },
        tests: {
            pop1M: String,
            total: Number,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                // eslint-disable-next-line no-param-reassign
                ret.statisticId = doc.id;
                // eslint-disable-next-line no-param-reassign
                delete ret._id;
                return ret;
            },
        },
    },
);

export default model<StatisticDocument>(ModelNames.Statistic, statisticSchema);
