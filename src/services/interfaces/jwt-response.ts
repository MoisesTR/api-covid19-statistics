import { UserDocument } from '@db/documents/user';
import Express, { NextFunction } from 'express';

export interface JWTResponse {
    ensureAuth: (req: Express.Request, res: Express.Response, next: NextFunction) => Promise<void>;
    createAccessToken: (
        user: UserDocument,
        validityMinutes: number,
    ) => Promise<{ _token: string; expiration: number }>;
    createRefreshToken: (
        user: UserDocument,
        validityMinutes: number,
    ) => Promise<{ _token: string; expiration: number }>;
}
