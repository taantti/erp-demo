import express from 'express';
import mongoose from 'mongoose';
import config from './config.js';
import routes from './routes/index.js';
import aux from "./utils/auxiliary.js";
//import dotenv from 'dotenv';

//dotenv.config();
//const { DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, PORT} = process.env;

//console.log("DATABASE_HOST", DATABASE_HOST);

aux.cLog("DATABASE_HOST = " + config.DATABASE_HOST);
aux.cLog("DATABASE_PORT = " + config.DATABASE_PORT);
aux.cLog("DATABASE_NAME = " + config.DATABASE_NAME);
aux.cLog("DATABASE_USERNAME = " + config.DATABASE_USERNAME);
aux.cLog("DATABASE_PASSWORD = " + config.DATABASE_PASSWORD);
aux.cLog("PORT = " + config.PORT);

const app = express();
app.use(express.json());
app.use(aux.logRequest); // Todo: Siirra middleware kansioon ja omaan logger.js tiedostoon.

/* Public routes */
//app.use('/login', routes.login);
//app.use('/help', routes.help);

app.use('/login', routes.login);

/* Middlewares */
// auth
app.use('/users', routes.users);
app.use('/user', routes.user);

app.use('/tenants', routes.tenants);
app.use('/tenant', routes.tenant);

mongoose.connect(`mongodb://${config.DATABASE_HOST}:${config.DATABASE_PORT}/${config.DATABASE_NAME}`).then(() => {
    aux.cLog(`Connected to mongodb://${config.DATABASE_HOST}:${config.DATABASE_PORT}/${config.DATABASE_NAME} database`);

    app.listen(config.PORT, () => {
        aux.cLog(`Server running on port ${config.PORT}`);
    }); 

}).catch((error) => {
    aux.cLog(`Connection to mongodb://${config.DATABASE_HOST}:${config.DATABASE_PORT}/${config.DATABASE_NAME} database failed`);
    aux.cLog(`${error.name}: ${error.message}`);
    process.exit(1);
});