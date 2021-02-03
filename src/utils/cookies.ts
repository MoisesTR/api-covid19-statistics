import Express from 'express';
import ENV from '@environment/environment';
import { CookieType } from '@services/enums/cookies.enum';
import { LoginResponseDto } from '@services/dtos/login.dto';
import { DateTime } from 'luxon';

function setCookie(
    req: Express.Request,
    res: Express.Response,
    cookieType: CookieType,
    token: string,
    expiration: number,
): void {
    res.cookie(cookieType, token, {
        expires: DateTime.fromMillis(expiration).toJSDate(),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
    });
}

function setTokenCookie(
    req: Express.Request,
    res: Express.Response,
    loginResponse: LoginResponseDto,
): void {
    if (loginResponse.token && loginResponse.expiration) {
        setCookie(
            req,
            res,
            CookieType._AccessToken,
            loginResponse.token,
            loginResponse.expirationRefresh || loginResponse.expiration,
        );
    }

    if (loginResponse.refreshToken && loginResponse.expirationRefresh) {
        setCookie(
            req,
            res,
            CookieType._RefreshToken,
            loginResponse.refreshToken,
            loginResponse.expirationRefresh,
        );
    }
}

export { setCookie, setTokenCookie };
