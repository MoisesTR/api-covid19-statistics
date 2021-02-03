import { POST, route, before, GET } from 'awilix-express';
import { matchedData } from 'express-validator';
import UserService from '@services/user.service';
import { validParams } from '@utils/generic-validations';
import { UserRegisterDto } from '@services/dtos/user.dto';
import { Request, Response } from 'express';
import {
    refreshTokenValidator,
    signInValidator,
    signUpValidator,
} from '@services/validations/validations/auth.validation';
import { LoginUserDto } from '@services/dtos/login.dto';
import AuthService from '@services/auth.service';
import { setCookie, setTokenCookie } from '@utils/cookies';
import { CookieType } from '@services/enums/cookies.enum';
import logger from '@utils/logger';
import { Types } from 'mongoose';
import AppError from '@utils/app-error';
import { dataUserForLogin } from '@utils/login';
import { ensureAuth } from '@services/jwt';

@route('/auth/')
export default class AuthenticationController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @route('signup')
    @before([signUpValidator, validParams])
    @POST()
    public async createUser(req: Request, res: Response): Promise<void> {
        const userCreateDto = matchedData(req) as UserRegisterDto;

        const user = await this.userService.createUser(userCreateDto);
        res.send(user);
    }

    @route('signin')
    @before([signInValidator, validParams])
    @POST()
    public async authenticate(req: Request, res: Response): Promise<void> {
        const loginUserDto = matchedData(req) as LoginUserDto;

        const loginResponse = await this.authService.authenticate({
            ...loginUserDto,
            returnTokens: true,
        });

        if (loginUserDto.returnTokens) {
            res.send(loginResponse);
        } else {
            setTokenCookie(req, res, loginResponse);
            res.send({ user: loginResponse.user });
        }
    }

    @route('refresh-token')
    @before([refreshTokenValidator, validParams])
    @POST()
    public async refreshToken(req: Request, res: Response): Promise<void> {
        const refreshToken = req.cookies[CookieType._RefreshToken];

        const { userName, token } = await this.authService.refreshToken(refreshToken);

        setCookie(req, res, CookieType._AccessToken, token._token, token.expiration);
        logger.info(`New refresh token for ${userName}`, {
            token: token._token,
            refreshToken,
        });
        res.status(200).json({
            message: 'Successfully updated!',
        });
    }

    @route('logout')
    @before([ensureAuth])
    @GET()
    // eslint-disable-next-line class-methods-use-this
    public logout(_req: Request, res: Response): void {
        res.clearCookie(CookieType._AccessToken);
        res.clearCookie(CookieType._RefreshToken);
        res.status(200).json({
            message: 'success',
        });
    }

    @route('me')
    @before([ensureAuth])
    @GET()
    public async getAuthenticationInfo(req: Request, res: Response): Promise<void> {
        const userId = req.user?.id;
        const user = await this.userService.findUserById(new Types.ObjectId(userId));

        if (!user) {
            throw new AppError(`The token's user was not found.`, 500);
        }

        res.send(dataUserForLogin(user));
    }
}
