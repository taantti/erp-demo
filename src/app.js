const PORT = 8000; // Todo: Oma env tiedosto.
const DATABASE_ADDRESS = 'mongodb://localhost:27017/';
const DATABASE_NAME = 'erp-demo';
const DATABASE_USERNAME = '';
const DATABASE_PASSWORD = '';
import express from 'express';
import mongoose from 'mongoose';

//import userRoutes from './routes/userRoutes.js';
import routes from './routes/index.js';
import aux from "./utils/auxiliary.js";

const app = express();
app.use(express.json());
app.use(aux.logRequest); // Todo: Omaan middleware kansioon ja .js tiedostoon.

//app.use('/user', userRoutes);
app.use('/user', routes.user);
app.get('/', (req, res) => response(res));

mongoose.connect(`${DATABASE_ADDRESS}${DATABASE_NAME}`).then(() => {
    aux.cLog(`Connected to ${DATABASE_ADDRESS}${DATABASE_NAME} database`);

    app.listen(PORT, () => {
        aux.cLog(`Server running on port ${PORT}`);
    });  

}).catch(() => {
    aux.cLog(`Connection to ${DATABASE_ADDRESS}${DATABASE_NAME} database failed`);
});



const response = (res) => {
    aux.cLog(`ERP-DEMO: app.js`);
}