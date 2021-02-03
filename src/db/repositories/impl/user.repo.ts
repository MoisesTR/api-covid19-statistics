/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { UserDocument, UserModel } from '@db/documents/user';
import { UserRegisterDto } from '@services/dtos/user.dto';
import AppError from '@utils/app-error';
import { Types } from 'mongoose';
import { BaseRepo } from './base-repo.repo';
import UserRepo from '../interfaces/user.repo';

export default class UserRepoImpl extends BaseRepo<UserDocument> implements UserRepo {
    constructor(protected readonly userModel: UserModel) {
        super(userModel);
    }

    public findUserById(userId: Types.ObjectId): Promise<UserDocument | null> {
        return this.Model.findById(userId).select('+passwordHash').exec();
    }

    public async findUserByUserName(userName: string): Promise<UserDocument | null> {
        const filter = { [this.nameOf('userName')]: userName };
        const user = await this.userModel.findOne(filter).select('+passwordHash');
        return user;
    }

    public async createUser(user: UserRegisterDto): Promise<UserDocument> {
        try {
            const newUser = await this.create(user);
            return newUser;
        } catch (err) {
            if (err.code === 11000) {
                if (err.keyPattern.userName) {
                    throw new AppError(
                        'The username selected is already registered, please select another.',
                        409,
                    );
                }
                throw new AppError('Duplicated user', 409, 'DUSER');
            }
            throw err;
        }
    }
}
