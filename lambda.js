import serverlessExpress from '@vendia/serverless-express';
import mongoose from 'mongoose';
import app from './src/app.js';
import config from './src/config.js';
 
let connection;

/**
 * Lambda handler for the Express app.
 * @param {Object} event - The event object.
 * @param {Object} context - The context object.
 * @returns {Promise<Object>} The response object.
 */
export const handler = async (event, context) => {
    if (!connection) {
        const dbUri = config.DATABASE_URI || (
            config.DATABASE_USERNAME && config.DATABASE_PASSWORD
                ? `mongodb://${config.DATABASE_USERNAME}:${config.DATABASE_PASSWORD}@${config.DATABASE_HOST}:${config.DATABASE_PORT}/${config.DATABASE_NAME}`
                : `mongodb://${config.DATABASE_HOST}:${config.DATABASE_PORT}/${config.DATABASE_NAME}`
        );
            
        connection = await mongoose.connect(dbUri);
    }
    
    return serverlessExpress({ app })(event, context);
};
