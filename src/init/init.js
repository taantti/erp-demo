/*
    init.js 
    Initializes the database with default data. (roles, tenants, users).
    See: .env file for INIT option.
    Use: npm run init    
*/

import mongoose from 'mongoose';
import fs from 'fs';
import bcrypt from "bcrypt";
import config from './../config.js';
import aux from "./../utils/auxiliary.js";
import { User, Tenant, Role } from './../models/index.js';

/*
* Connect to MongoDB database.
* @returns {Boolean} - Returns true if connection was successful, otherwise false.
*/
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

/*
* Load JSON data from file.
* @param {String} filePath - Path to the JSON file.
* @returns {Object|Boolean} - Returns the parsed JSON object if successful, otherwise false
*/
const loadJsonData = async (filePath) => {
    aux.cLog("loadJsonData: filePath = " + filePath);

    try {
        return JSON.parse(await fs.promises.readFile(filePath));
    } catch (error) {
        aux.cLog("saveTenantData(): Error reading file " + filePath + ". Error: " + error);
        return false;
    }
}

/*
* Load role permissions from file.
* @param {String} role - Role name (e.g., 'OVERSEER', 'ADMIN', 'WRITER', 'READER').
* @returns {Object|Boolean} - Returns the role permissions object if successful, otherwise false.
*/
const loadRolePermissions = async (role) => {
    aux.cLog("loadRolePermissions: role = " + role);
    switch (role) {
        case 'OVERSEER':
            return await loadJsonData(new URL('./overseerPermissions.json', import.meta.url));
        case 'ADMIN':
            return await loadJsonData(new URL('./adminPermissions.json', import.meta.url));
        case 'WRITER':
            return await loadJsonData(new URL('./writerPermissions.json', import.meta.url));
        case 'READER':
            return await loadJsonData(new URL('./readerPermissions.json', import.meta.url));
        default:
            return false;
    };
}

/*
* Save roles.
* @param {Array} roles - Array of role objects.
* @returns {Boolean} - Returns true if saving was successful, otherwise false.
*/
const saveRoleData = async (roles) => {
    aux.cLog("saveRoleData: roles = " + roles);
    if (!Array.isArray(roles)) return false;
    //aux.cLog("saveRoleData: roles = " + JSON.stringify(roles, null, 2));

    for (const roleData of roles) {

        const { name, role } = roleData;

        aux.cLog("saveRoleData: name = " + name);
        aux.cLog("saveRoleData: role = " + role);

        const rolePermissions = await loadRolePermissions(role);

        if (!rolePermissions) {
            aux.cLog("saveRoleData(): Error loading role permissions for role " + role);
            return false;
        }

        //aux.cLog("saveRoleData: rolePermissions = " + JSON.stringify(rolePermissions, null, 2));


        for (const [feature, featureObj] of Object.entries(rolePermissions)) {
            aux.cLog(`Feature: ${feature}`);
            for (const [permissionName, permissionDetails] of Object.entries(featureObj)) {
                //aux.cLog(`  Permission: ${permissionName}, Details: ${JSON.stringify(permissionDetails)}`);
                /*
                aux.cLog(`Permission: ${permissionName}:`);
                aux.cLog(`  access: ${permissionDetails.access}`);
                aux.cLog(`  adminTenantOnly: ${permissionDetails.adminTenantOnly}`);
                aux.cLog(`  immutable: ${permissionDetails.immutable}`);
                */
            }
        }

        /*
         Change objects to Map types.
         This is necessary because the RoleSchema defines the rolePermission fields as Map types.
        */
        const rolePermission = {
            product: new Map(Object.entries(rolePermissions.product)),
            role: new Map(Object.entries(rolePermissions.role)),
            tenant: new Map(Object.entries(rolePermissions.tenant)),
            user: new Map(Object.entries(rolePermissions.user))
        };


        try {
            const roleModel = new Role({ name: name, role: role, rolePermission: rolePermissions });
            if (!roleModel.save()) return false;
        } catch (error) {
            aux.cLog("saveRoleData(): error " + error.message);
            return false;
        }


    }

    return true;
}

/* Save tenants.
@param {Array} tenants - Array of tenant objects.
@returns {Object|Boolean} - Returns the saved tenant model if successful, otherwise false.
*/
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

/*
* Save users. Tenant is passed as parameter.
* @param {Array} users -  Array of user objects.
* @param {Object} tenantModel - Tenant model to which users are linked.
* @returns {Boolean} - Returns true if saving was successful, otherwise false.
*/
const saveUserData = async (users, tenantModel) => {

    aux.cLog("saveUserData(): tenant = " + JSON.stringify(users));


    for (const userData of users) {
        const { username, password, first_name, last_name, email, role, active } = userData;
        const tenant = tenantModel._id;
        const saltRounds = config.BCRYPT_SALT_ROUNDS | 10;

        try {
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);
            const userModel = new User({ username, password: hashedPassword, first_name, last_name, email, role, active, tenant });
            if (!await userModel.save()) return false;
        } catch (error) {
            aux.cLog("saveUserData(): error " + error.message);
            return false;
        }
    }

    return true;
}

if (config.INIT !== true) { // Skip init if not explicitly enabled in .env
    aux.cLog("Skip init. Use .env:  INIT = TRUE to continue.");
    process.exit(1);
}

(async () => {
    const connected = await connectMongoose();
    aux.cLog(`connected = ${connected}`);
    if (!connected) process.exit(1); // 1 = error

    await saveRoleData(await loadJsonData(new URL('./roles.json', import.meta.url)));
    const tenantModel = await saveTenantData(await loadJsonData(new URL('./tenants.json', import.meta.url)));
    await saveUserData(await loadJsonData(new URL('./users.json', import.meta.url)), tenantModel);
    process.exit(0); // 0 = success
})();
