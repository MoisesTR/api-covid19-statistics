import { UserDocument, UserModel } from '@db/documents/user';
import jwt from 'jsonwebtoken';
import AppError from '@utils/app-error';
import ENV from '@environment/environment';
import { NextFunction, Request, Response } from 'express';
import logger from '@utils/logger';
import { setCookie } from '@utils/cookies';
import { container } from 'container';
import { DateTime } from 'luxon';
import { Token } from './interfaces/token';
import { CustomPayload } from './interfaces/payload';
import { CookieType } from './enums/cookies.enum';

const createToken = (
    customPayload: CustomPayload,
    secret: string,
    tokenDurationMinutes: number,
): Token => {
    const payload = {
        ...customPayload,
        exp: DateTime.utc().plus({ minutes: tokenDurationMinutes }).toMillis(),
    };

    const _token = jwt.sign(payload, secret);
    return { _token, expiration: payload.exp };
};

const createAccessToken = (
    user: UserDocument,
    accessTokenDuration: number = ENV.ACCESS_TOKEN_DURATION,
): Token => {
    return createToken(
        {
            sub: user._id,
            userName: user.userName,
        },
        ENV.JWT_SECRET,
        accessTokenDuration,
    );
};

const createRefreshToken = (
    user: UserDocument,
    refreshTokenDuration: number = ENV.REFRESH_TOKEN_DURATION,
): Token => {
    return createToken(
        {
            sub: user._id,
            userName: user.userName,
        },
        ENV.JWT_REFRESH_SECRET,
        refreshTokenDuration,
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function verifyToken(token: string, secret: string): any {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let decoded: any;
    try {
        decoded = jwt.verify(token, secret);
        return decoded;
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            decoded = jwt.decode(token, { complete: true });
            if (!decoded && typeof decoded !== 'string') {
                throw new AppError('Decoded Cannot be null!', 400);
            }
            decoded.payload.isExpired = true;
            return decoded.payload;
        }
        err.code = 'EITOKEN';
        err.status = 401;
        throw err;
    }
}

/**
 * @name ensureAuth
 * @description
 */
const ensureAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token;

    if (req.get('authorization')) {
        token = req.get('authorization')?.replace(/['"]+/g, '').replace('Bearer ', '');
    } else if (req.cookies[CookieType._AccessToken]) {
        token = req.cookies[CookieType._AccessToken];
    }

    if (!token) {
        return next(
            new AppError(`The request doesn't have the authentication token`, 400, 'NAUTH'),
        );
    }

    const decode = verifyToken(token, ENV.JWT_SECRET);
    const userModel: UserModel = container.resolve('userModel');
    const user: UserDocument | null = await userModel.findById(decode.sub);
    logger.info('Setting the user cache');

    if (!user) {
        return next(new AppError('User not found', 404, 'UNFOUND'));
    }

    if (decode.isExpired) {
        if (req.cookies[CookieType._RefreshToken]) {
            try {
                const refreshToken = req.cookies[CookieType._RefreshToken];
                const decodedRefresh = verifyToken(refreshToken, ENV.JWT_REFRESH_SECRET);

                if (decodedRefresh.sub !== decode.sub) {
                    return next(new AppError(`Token users don't match`, 405));
                }
                if (decodedRefresh.isExpired) {
                    return next(
                        new AppError(
                            'Refresh token expired, please login again',
                            401,
                            'TOKENEXPIRED',
                        ),
                    );
                }
                const { _token: tokenGen } = createAccessToken(user);

                setCookie(req, res, CookieType._AccessToken, tokenGen, decodedRefresh.exp);
                req.user = user;
                return next();
            } catch (err) {
                res.clearCookie(CookieType._AccessToken);
                throw err;
            }
        }
        return next(new AppError('Access token expired, update again!', 401, 'TOKENEXPIRED'));
    }
    req.user = user;
    return next();
};

export { createAccessToken, createRefreshToken, ensureAuth, verifyToken };
