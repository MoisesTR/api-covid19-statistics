import { body, check } from 'express-validator';

const addNewCasesValidator = [
    check('newCases', 'New field must be a number').isInt().toInt().optional({ nullable: true }),
    check('active', 'Active field must be a number').isInt().toInt().optional({ nullable: true }),
    check('recovered', 'Recovered field must be a number')
        .isInt()
        .toInt()
        .optional({ nullable: true }),
    check('critical', 'Critical field must be a number')
        .isInt()
        .toInt()
        .optional({ nullable: true }),
];

const addNewDeathsValidator = [body('newCases', 'New field must be a number').isInt().toInt()];

const addNewTestsValidator = [body('newTests', 'New field must be a number').isInt().toInt()];

export { addNewCasesValidator, addNewDeathsValidator, addNewTestsValidator };
