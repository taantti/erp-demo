import express from 'express';
import mongoose from 'mongoose';
import env from './config.js';
import routes from './routes/index.js';
import aux from "./utils/auxiliary.js";
import dotenv from 'dotenv';

dotenv.config();
const { DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, PORT} = process.env;
aux.cLog("DATABASE_HOST = " + env.DATABASE_HOST);
aux.cLog("DATABASE_PORT = " + env.DATABASE_PORT);
aux.cLog("DATABASE_NAME = " + env.DATABASE_NAME);
aux.cLog("DATABASE_USERNAME = " + env.DATABASE_USERNAME);
aux.cLog("DATABASE_PASSWORD = " + env.DATABASE_PASSWORD);
aux.cLog("PORT = " + env.PORT);

const app = express();
app.use(express.json());
app.use(aux.logRequest); // Todo: Siirra middleware kansioon ja omaan logger.js tiedostoon.

/* Public routes */
//app.use('/login', routes.login);
//app.use('/help', routes.help);

/* Middlewares */
// auth

//app.use('/logout', routes.logout);
app.use('/user', routes.user);
//app.use('/product', routes.product);
//app.get('/', (req, res) => response(res));

mongoose.connect(`mongodb://${env.DATABASE_HOST}:${env.DATABASE_PORT}/${env.DATABASE_NAME}`).then(() => {
    aux.cLog(`Connected to mongodb://${env.DATABASE_HOST}:${env.DATABASE_PORT}/${env.DATABASE_NAME} database`);

    app.listen(PORT, () => {
        aux.cLog(`Server running on port ${env.PORT}`);
    });  

}).catch(() => {
    aux.cLog(`Connection to mongodb://${env.DATABASE_HOST}:${env.DATABASE_PORT}/${env.DATABASE_NAME} database failed`);
});

const response = (res) => {
    // TODO: Return README
    aux.cLog(`ERP-DEMO: app.js`);
    res.status(200).json({msg: "OK"});
}