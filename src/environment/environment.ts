import Environment from './environment.interface';

const parseToNumber = (possible: string | undefined, defaultVal: number) =>
    possible ? +possible : defaultVal;

const envVar: Environment = {
    SERVER_PORT: parseToNumber(process.env.PORT, 3000),
    JWT_SECRET: process.env.JWT_SECRET || 'ALD3B@R@N',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '@LPH@C3NT@URI',
    NODE_ENV: process.env.NODE_ENV || 'development',
    ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN || 'http://localhost:4200',

    // Mongodb connection
    MONGO_DB_USERNAME: process.env.MONGO_DB_USERNAME || 'covidUser',
    MONGO_DB_NAME: process.env.MONGO_DB_NAME || 'covid19',
    MONGO_DB_USER_PWD: process.env.MONGO_DB_USER_PWD || 'pleyades7',
    MONGO_DB_URL: process.env.MONGO_DB_URL || 'covid19-statistics.outgs.mongodb.net',
    MONGO_DB_QUERY_PARAMS: process.env.MONGO_DB_QUERY_PARAMS || 'retryWrites=true',

    // Tokens config
    ACCESS_TOKEN_DURATION: parseToNumber(process.env.ACCESS_TOKEN_DURATION, 30),
    REFRESH_TOKEN_DURATION: parseToNumber(process.env.REFRESH_TOKEN_DURATION, 60),
};

export default envVar;
