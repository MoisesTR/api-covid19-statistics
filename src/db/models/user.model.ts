import { model, Schema } from 'mongoose';
import { ModelNames } from 'db/enums/model-names.enum';
import bcrypt from 'bcrypt';
import { UserDocument } from '@db/documents/user';

const userSchema = new Schema<UserDocument>(
    {
        userName: {
            type: String,
            trim: true,
            required: true,
            lowercase: true,
            unique: true,
            index: true,
        },
        country: String,
        salt: {
            type: String,
            required: true,
        },
        passwordHash: {
            type: String,
            required: true,
            select: false,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                // eslint-disable-next-line no-param-reassign
                ret.userId = doc.id;
                // eslint-disable-next-line no-param-reassign
                delete ret._id;
                // eslint-disable-next-line no-param-reassign
                delete ret.passwordHash;
                // eslint-disable-next-line no-param-reassign
                delete ret.salt;
                return ret;
            },
        },
    },
);

userSchema.virtual('password').set(async function virtualPassword(password: string) {
    this._password = password;
});

userSchema.pre<UserDocument>('validate', async function virtualValidate(next) {
    if (this._password) {
        this.salt = await bcrypt.genSalt();
        this.passwordHash = await bcrypt.hash(this._password, this.salt);
    }
    next();
});

userSchema.methods.validatePassword = async function validatePassword(possiblePassword: string) {
    const hash = await bcrypt.hash(possiblePassword, this.salt);
    return hash === this.passwordHash;
};

export default model<UserDocument>(ModelNames.User, userSchema);
