import AppError from 'utils/app-error';
import { Types } from 'mongoose';
import { UserDocument } from '@db/documents/user';
import { getAuthenticationResponse } from '@utils/login';
import ENV from '@environment/environment';
import UserService from './user.service';
import { LoginResponseDto, LoginUserDto } from './dtos/login.dto';
import { Token } from './interfaces/token';
import { RefreshToken } from './interfaces/refresh-token';
import { createAccessToken, verifyToken } from './jwt';

export default class AuthService {
    constructor(private readonly userService: UserService) {}

    public async authenticate(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
        const user = await this.userService.findUserByName(loginUserDto.userName);

        if (!user) {
            throw new AppError('User not found!', 404, 'NEXIST');
        }

        await AuthService.validateUser(user, loginUserDto.password);
        return getAuthenticationResponse(user, loginUserDto.returnTokens);
    }

    private static async validateUser(user: UserDocument, password: string) {
        const isValidPassword = await user.validatePassword(password);

        if (!isValidPassword) {
            throw new AppError('Incorrect password, try again!', 401, 'EPASSW');
        }
    }

    public async refreshToken(
        refreshToken: string,
    ): Promise<{
        userName: string;
        token: Token;
    }> {
        if (!refreshToken) {
            throw new AppError('The request must have the refresh token in the cookies', 400);
        }

        let decoded: RefreshToken;

        try {
            decoded = verifyToken(refreshToken, ENV.JWT_REFRESH_SECRET) as RefreshToken;
        } catch (_e) {
            throw new AppError('Invalid token.', 401);
        }

        const user = await this.userService.findUserById(new Types.ObjectId(decoded.sub));

        if (!user) {
            throw new AppError('Refresh token is not valid.', 401, 'DTOKEN');
        }

        return {
            userName: user.userName,
            token: createAccessToken(user, ENV.ACCESS_TOKEN_DURATION),
        };
    }
}
