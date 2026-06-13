import mongoose from 'mongoose';
import app from './app.js';
import config from './config.js';
import { log } from './utils/logger.js';
 
log("INFO", "DATABASE_HOST = " + config.DATABASE_HOST);
log("INFO", "DATABASE_PORT = " + config.DATABASE_PORT);
log("INFO", "DATABASE_NAME = " + config.DATABASE_NAME);
log("INFO", "PORT = " + config.PORT);
 
/* Connect to MongoDB and start the server */
const dbUri = config.DATABASE_USERNAME && config.DATABASE_PASSWORD
    ? `mongodb://${config.DATABASE_USERNAME}:${config.DATABASE_PASSWORD}@${config.DATABASE_HOST}:${config.DATABASE_PORT}/${config.DATABASE_NAME}`
    : `mongodb://${config.DATABASE_HOST}:${config.DATABASE_PORT}/${config.DATABASE_NAME}`;
 
mongoose.connect(dbUri).then(() => {
    log("INFO", `Connected to mongodb://${config.DATABASE_HOST}:${config.DATABASE_PORT}/${config.DATABASE_NAME} database`);
 
    app.listen(config.PORT, () => {
        log("INFO", `Server running on port ${config.PORT}`);
    });
 
}).catch((error) => {
    log("ERROR", `Connection to mongodb://${config.DATABASE_HOST}:${config.DATABASE_PORT}/${config.DATABASE_NAME} database failed`);
    log("ERROR", `${error.name}: ${error.message}`);
    process.exit(1);
});