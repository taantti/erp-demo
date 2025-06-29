import express from 'express';
import mongoose from 'mongoose';

//import userRoutes from './routes/userRoutes.js';

import env from './config.js';
import routes from './routes/index.js';
import aux from "./utils/auxiliary.js";

import dotenv from 'dotenv';
dotenv.config();
const { DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, PORT} = process.env;

const app = express();
app.use(express.json());
app.use(aux.logRequest); // Todo: Siirra middleware kansioon ja omaan logger.js tiedostoon.

console.log("DATABASE_HOST = " + env.DATABASE_HOST);
console.log("DATABASE_PORT = " + env.DATABASE_PORT);
console.log("DATABASE_NAME = " + env.DATABASE_NAME);
console.log("DATABASE_USERNAME = " + env.DATABASE_USERNAME);
console.log("DATABASE_PASSWORD = " + env.DATABASE_PASSWORD);
console.log("PORT = " + env.PORT);

//app.use('/user', userRoutes);
app.use('/user', routes.user);
app.get('/', (req, res) => response(res));

mongoose.connect(`mongodb://${env.DATABASE_HOST}:${env.DATABASE_PORT}/${env.DATABASE_NAME}`).then(() => {
    aux.cLog(`Connected to mongodb://${env.DATABASE_HOST}:${env.DATABASE_PORT}/${env.DATABASE_NAME} database`);

    app.listen(PORT, () => {
        aux.cLog(`Server running on port ${env.PORT}`);
    });  

}).catch(() => {
    aux.cLog(`Connection to mongodb://${env.DATABASE_HOST}:${env.DATABASE_PORT}/${env.DATABASE_NAME} database failed`);
});



const response = (res) => {
    aux.cLog(`ERP-DEMO: app.js`);
}