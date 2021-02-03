import { UserLoginInfoDto } from '@services/dtos/user.dto';
import { UserDocument } from '@db/documents/user';
import { LoginResponseDto } from '@services/dtos/login.dto';
import { Token } from '@services/interfaces/token';
import { createAccessToken, createRefreshToken } from '@services/jwt';
import logger from './logger';

const dataUserForLogin = (user: UserDocument): UserLoginInfoDto => {
    return {
        userId: user.id,
        userName: user.userName,
        country: user.country,
    };
};

const getAuthenticationResponse = async (
    userData: UserDocument,
    returnTokens: boolean,
): Promise<LoginResponseDto> => {
    const refreshToken: Token = createRefreshToken(userData);
    const accessToken: Token = createAccessToken(userData);

    let response: LoginResponseDto = {
        user: dataUserForLogin(userData),
    };

    if (returnTokens) {
        response = {
            ...response,
            token: accessToken._token,
            refreshToken: refreshToken._token,
            expiration: accessToken.expiration,
            expirationRefresh: refreshToken.expiration,
        };
    }

    logger.info(`UserModel ${userData.userName} logged`, {
        access: accessToken._token,
        refresh: refreshToken._token,
    });

    return response;
};

export { getAuthenticationResponse, dataUserForLogin };
