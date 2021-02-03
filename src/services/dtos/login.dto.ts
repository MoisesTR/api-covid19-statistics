import { UserLoginInfoDto } from './user.dto';

export interface LoginResponseDto {
    user: UserLoginInfoDto;
    token?: string;
    expiration?: number;
    refreshToken?: string;
    expirationRefresh?: number;
}

export interface LoginUserDto {
    userName: string;
    password: string;
    returnTokens: boolean;
}
