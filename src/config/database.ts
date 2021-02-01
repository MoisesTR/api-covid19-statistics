import envVars from '@environment/environment';

export default {
    mongoURI: `mongodb+srv://${envVars.MONGO_DB_USERNAME}:${envVars.MONGO_DB_USER_PWD}@${
        envVars.MONGO_DB_URL
    }/${envVars.MONGO_DB_NAME}${
        process.env.MONGO_DB_QUERY_PARAMS ? `?${process.env.MONGO_DB_QUERY_PARAMS}` : ''
    }`,
};
