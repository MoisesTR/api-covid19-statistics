import { UserDocument } from '@db/documents/user';

declare global {
    namespace Express {
        interface Request {
            user?: UserDocument;
        }
    }
}
