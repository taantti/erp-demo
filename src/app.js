import express from 'express';
import mongoose from 'mongoose';
import config from './config.js';
import { sanitizeAndValidateRequest }   from './middlewares/sanitizationMiddleware.js';
import authenticationMiddleware from './middlewares/authenticationMiddleware.js';
import validationErrorMiddleware from './middlewares/validationErrorMiddleware.js';
import errorHandler from './middlewares/errorMiddleware.js';
import routes from './routes/index.js';

import { log } from './utils/logger.js';
import helmet from "helmet";

log("INFO", "DATABASE_HOST = " + config.DATABASE_HOST);
log("INFO", "DATABASE_PORT = " + config.DATABASE_PORT);
log("INFO", "DATABASE_NAME = " + config.DATABASE_NAME);
log("INFO", "DATABASE_USERNAME = " + config.DATABASE_USERNAME);
log("INFO", "DATABASE_PASSWORD = " + config.DATABASE_PASSWORD);
log("INFO", "PORT = " + config.PORT);

/* Initialize Express app */
const app = express();

/* Security middleware */
app.use(helmet()); 

/* Body parser middleware */
app.use(express.json());

/* Sanitization middleware */
app.use(sanitizeAndValidateRequest);

/* Public routes */
app.use('/login', routes.login);

/* Authentication middleware */
app.use(authenticationMiddleware);

/* Protected routes */
app.use('/user', routes.user);
app.use('/tenant', routes.tenant);
app.use('/role', routes.role);

/* Error handling middlewares */
app.use(validationErrorMiddleware);
app.use(errorHandler);

/* Connect to MongoDB and start the server */
mongoose.connect(`mongodb://${config.DATABASE_HOST}:${config.DATABASE_PORT}/${config.DATABASE_NAME}`).then(() => {
    log("INFO", `Connected to mongodb://${config.DATABASE_HOST}:${config.DATABASE_PORT}/${config.DATABASE_NAME} database`);

    app.listen(config.PORT, () => {
        log("INFO", `Server running on port ${config.PORT}`);
    });

}).catch((error) => {
    log("ERROR", `Connection to mongodb://${config.DATABASE_HOST}:${config.DATABASE_PORT}/${config.DATABASE_NAME} database failed`, req);
    log("ERROR", `${error.name}: ${error.message}`, req);
    process.exit(1); // Exit the application if database connection fails. 1 = failure.
});