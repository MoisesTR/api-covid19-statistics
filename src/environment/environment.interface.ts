export default interface Environment {
    SERVER_PORT: number;
    JWT_REFRESH_SECRET: string;
    JWT_SECRET: string;
    NODE_ENV: string;
    ALLOWED_ORIGIN: string;
    MONGO_DB_USER_PWD: string;
    MONGO_DB_USERNAME: string;
    MONGO_DB_NAME: string;
    MONGO_DB_URL: string;
    MONGO_DB_QUERY_PARAMS: string;
    ACCESS_TOKEN_DURATION: number;
    REFRESH_TOKEN_DURATION: number;
}
