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

const saveRoleData = async (roles) => {
    for (const roleData of roles) {
        const { name, role } = roleData;
        try {
            const roleModel = new Role({ name, role });
            if (!roleModel.save()) return false;
        } catch (error) {
            aux.cLog("saveRoleData(): error " + error.message);
            return false;
        }
    }
}

const saveTenantData = async (tenants) => {
    aux.cLog("saveTenantData(): tenant = " + JSON.stringify(tenants));

    for (const tenantData of tenants) {
        

        const { name, admin, active } = tenantData;
        
        aux.cLog("saveTenantData(): tenant name = " + name);
        aux.cLog("saveTenantData(): tenant admin = " + admin);
        aux.cLog("saveTenantData(): tenant active = " + active);

        try {
            const tenantModel = new Tenant({ name, admin, active });
            if (!tenantModel.save()) return false;
            return tenantModel;
        } catch (error) {
            aux.cLog("saveTenantData(): error " + error.message);
            return false;
        }
    }

}

const saveUserData = async (users, tenantModel) => {
    for (const userData of users) {
        const { username, password, first_name, last_name,email, role, active } = userData;
        const tenant = tenantModel._id;
        try {
            const userModel = new User({username, password, first_name, last_name,email, role, active, tenant });
            if (!userModel.save()) return false;
        } catch (error) {
            aux.cLog("saveUserData(): error " + error.message);
            return false;
        }
    }
}

if (config.INIT !== true) {
    aux.cLog("Skip init. Use .env:  INIT = TRUE");
    process.exit(1);
}

(async () => {
    const connected = await connectMongoose();
    aux.cLog(`connected = ${connected}`);
    if (!connected) process.exit(1);

    await saveRoleData(await loadJsonData(new URL('./roles.json', import.meta.url)));
    const tenantModel = await saveTenantData(await loadJsonData(new URL('./tenants.json', import.meta.url)));
    await saveUserData(await loadJsonData(new URL('./users.json', import.meta.url)), tenantModel);
})();
