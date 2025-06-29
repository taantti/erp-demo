/*
const PORT = 8000; // Todo: Oma env tiedosto.
const DATABASE_ADDRESS = 'mongodb://localhost:27017/';
const DATABASE_NAME = 'erp-demo';
const DATABASE_USERNAME = '';
const DATABASE_PASSWORD = '';
*/
/*
DATABASE_HOST = localhost
DATABASE_PORT = 27017
DATABASE_NAME = 'erp-demo';
DATABASE_USERNAME = '';
DATABASE_PASSWORD = '';
PORT = 8000;
*/



import express from 'express';
import mongoose from 'mongoose';

//import userRoutes from './routes/userRoutes.js';
import routes from './routes/index.js';
import aux from "./utils/auxiliary.js";
import dotenv from 'dotenv';

dotenv.config();
const { DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, PORT} = process.env;

const app = express();
app.use(express.json());
app.use(aux.logRequest); // Todo: Omaan middleware kansioon ja .js tiedostoon.

//app.use('/user', userRoutes);
app.use('/user', routes.user);
app.get('/', (req, res) => response(res));


//const DATABASE_ADDRESS = 'mongodb://localhost:27017/';

mongoose.connect(`mongodb://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`).then(() => {
    aux.cLog(`Connected to ${DATABASE_HOST}${DATABASE_NAME} database`);

    app.listen(PORT, () => {
        aux.cLog(`Server running on port ${PORT}`);
    });  

}).catch(() => {
    aux.cLog(`Connection to mongodb://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME} database failed`);
});



const response = (res) => {
    aux.cLog(`ERP-DEMO: app.js`);
}