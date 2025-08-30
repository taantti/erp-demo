import express from 'express';
import mongoose from 'mongoose';
import config from './config.js';
import sanitizationMiddleware  from './middleware/sanitizationMiddleware.js';
import authenticationMiddleware from './middleware/authenticationMiddleware.js';
import routes from './routes/index.js';
import aux from "./utils/auxiliary.js";
import helmet from "helmet";

aux.cLog("DATABASE_HOST = " + config.DATABASE_HOST);
aux.cLog("DATABASE_PORT = " + config.DATABASE_PORT);
aux.cLog("DATABASE_NAME = " + config.DATABASE_NAME);
aux.cLog("DATABASE_USERNAME = " + config.DATABASE_USERNAME);
aux.cLog("DATABASE_PASSWORD = " + config.DATABASE_PASSWORD);
aux.cLog("PORT = " + config.PORT);

const app = express();
app.use(helmet()); // Security middleware.
app.use(express.json());
app.use(aux.logRequest); // Todo: Siirra middleware kansioon ja omaan logger.js tiedostoon.

/* Sanitization middleware */
app.use(sanitizationMiddleware);

/* Public routes */
app.use('/login', routes.login);

/* Authentication middleware */
app.use(authenticationMiddleware);

/* Protected routes */
app.use('/user', routes.user);
app.use('/tenant', routes.tenant);
app.use('/role', routes.role);

/* TODO: Error handling middleware */

/* Connect to MongoDB and start the server */
mongoose.connect(`mongodb://${config.DATABASE_HOST}:${config.DATABASE_PORT}/${config.DATABASE_NAME}`).then(() => {
    aux.cLog(`Connected to mongodb://${config.DATABASE_HOST}:${config.DATABASE_PORT}/${config.DATABASE_NAME} database`);

    app.listen(config.PORT, () => {
        aux.cLog(`Server running on port ${config.PORT}`);
    }); 

}).catch((error) => {
    aux.cLog(`Connection to mongodb://${config.DATABASE_HOST}:${config.DATABASE_PORT}/${config.DATABASE_NAME} database failed`);
    aux.cLog(`${error.name}: ${error.message}`);
    process.exit(1); // Exit the application if database connection fails. 1 = failure.
});