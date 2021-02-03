import { getMessageMinMaxChar } from '@utils/generic-validations';
import { body } from 'express-validator';

const signInValidator = [
    body('userName', getMessageMinMaxChar('Username', 4, 10))
        .exists()
        .isString()
        .isLength({ min: 4, max: 10 }),
    body('password', getMessageMinMaxChar('Password', 5, 25)).isLength({
        min: 5,
        max: 25,
    }),
    body('returnTokens').isBoolean().optional({ nullable: true }),
];

const signUpValidator = [
    body('userName', getMessageMinMaxChar('Username', 4, 10)).isLength({
        min: 4,
        max: 10,
    }),
    body('country', 'Please, select the country').isString(),
    body('password', getMessageMinMaxChar('Password', 5, 25)).isLength({
        min: 5,
        max: 25,
    }),
];

const refreshTokenValidator = [body('userName').exists()];

export { signInValidator, signUpValidator, refreshTokenValidator };
