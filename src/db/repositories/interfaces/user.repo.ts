import { UserDocument } from '@db/documents/user';
import { UserRegisterDto } from '@services/dtos/user.dto';
import { Types } from 'mongoose';

export default interface UserRepo {
    findUserById(userId: Types.ObjectId): Promise<UserDocument | null>;
    findUserByUserName(userName: string): Promise<UserDocument | null>;
    createUser(user: UserRegisterDto): Promise<UserDocument>;
}
