// npm run init
import mongoose from 'mongoose';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import config from './../config.js';
import aux from "./../utils/auxiliary.js";
import { User, Tenant, Role } from './../models/index.js';

const connectMongoose = async () => {
    aux.cLog("connectMongoose(): ");
    try {
        await mongoose.connect(`mongodb://${config.DATABASE_HOST}:${config.DATABASE_PORT}/${config.DATABASE_NAME}`);
        aux.cLog(`Connected to mongodb://${config.DATABASE_HOST}:${config.DATABASE_PORT}/${config.DATABASE_NAME} database`);
        return true;
    } catch (error) {
        aux.cLog(`Connection to mongodb://${config.DATABASE_HOST}:${config.DATABASE_PORT}/${config.DATABASE_NAME} database failed`);
        aux.cLog(`${error.name}: ${error.message}`);
        return false;
    }
}

const loadJsonData = async (filePath) => {
    aux.cLog("loadJsonData: filePath = " + filePath);

    try {
        const jsonData = await fs.promises.readFile(filePath);
        return JSON.parse(jsonData);
    } catch (error) {
        aux.cLog("saveTenantData(): Error reading file " + filePath + ". Error: " + error);
        return false;
    }

}

const saveTenantData = async (tenant) => {
    aux.cLog("saveTenantData(): tenant = " + tenant);
}

const saveRoleData = async (roles) => {
    aux.cLog("saveRoleData(): roles = " + roles);
}


const saveUserData = async (users) => {
    aux.cLog("saveUserData: users = " + users);
}


aux.cLog(`config.INIT = ${config.INIT}`);


if (config.INIT !== true) {
    aux.cLog("Skip init. Use .env:  INIT = TRUE");
    process.exit(1);
}

(async () => {
    const connected = await connectMongoose();
    aux.cLog(`connected = ${connected}`);
    if (!connected) process.exit(1);
    await saveTenantData(await loadJsonData(new URL('./tenants.json', import.meta.url)));
    await saveUserData(await loadJsonData(new URL('./users.json', import.meta.url)));
})();
