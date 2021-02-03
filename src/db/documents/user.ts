import { Document, Model } from 'mongoose';

export interface UserDocument extends Document {
    userName: string;
    country: string;
    salt: string;
    passwordHash: string;

    // Virtual
    password?: string;
    _password?: string;

    verifyToken: () => Promise<UserDocument>;
    createPasswordResetToken: () => string;
    validatePassword: (possiblePassword: string) => Promise<boolean>;
}
export type UserModel = Model<UserDocument>;
