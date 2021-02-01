import mongoose from 'mongoose';
import EnvVar from '@environment/environment';
import dbConfig from '@config/database';
import logger from '@utils/logger';

export const connnectDb = async (): Promise<void> => {
    logger.info(dbConfig.mongoURI);
    await mongoose.connect(dbConfig.mongoURI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        autoIndex: EnvVar.NODE_ENV !== 'production',
        useUnifiedTopology: true,
    });
    logger.info('Mongo is Connected');
    process.on('SIGTERM', () => {
        logger.error('The signal has been interrupt!');
        mongoose.connection.close(() => {
            logger.info('Interrupt Signal, the mongo connection has been close!');
            process.exit(1);
        });
    });
};
