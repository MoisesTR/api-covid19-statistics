import AppError from 'utils/app-error';
import UserRepo from '@db/repositories/interfaces/user.repo';
import { UserRegisterDto } from '@services/dtos/user.dto';
import { UserDocument } from '@db/documents/user';
import { Types } from 'mongoose';

export default class UserService {
    private readonly MSG_USER_NOT_FOUND = `The user doesn't exists`;

    constructor(private readonly userRepo: UserRepo) {}

    public async findUserById(userId: Types.ObjectId): Promise<UserDocument | null> {
        const user = await this.userRepo.findUserById(userId);

        if (!user) {
            throw new AppError(this.MSG_USER_NOT_FOUND, 404);
        }

        return user;
    }

    public async findUserByName(userName: string): Promise<UserDocument | null> {
        const user = await this.userRepo.findUserByUserName(userName);

        if (!user) {
            throw new AppError(this.MSG_USER_NOT_FOUND, 404);
        }

        return user;
    }

    public async createUser(userCreate: UserRegisterDto): Promise<UserDocument | undefined> {
        return this.userRepo.createUser(userCreate);
    }
}
