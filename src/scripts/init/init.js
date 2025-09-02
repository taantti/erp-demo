/*
    init.js 
    Initializes the database with default data. (roles, tenants, users).
    See: .env file for INIT option.
    Use: npm run init    
*/

import mongoose from 'mongoose';
import fs from 'fs';
import bcrypt from "bcrypt";
import config from '../../config.js';
import { User, Tenant, Role } from '../../models/index.js';
import { log } from '../../utils/logger.js';

/*
* Connect to MongoDB database.
* @returns {Boolean} - Returns true if connection was successful, otherwise false.
*/
const connectMongoose = async () => {
    log("INFO", "connectMongoose(): ", true);
    try {
        await mongoose.connect(`mongodb://${config.DATABASE_HOST}:${config.DATABASE_PORT}/${config.DATABASE_NAME}`);
        log(`Connected to mongodb://${config.DATABASE_HOST}:${config.DATABASE_PORT}/${config.DATABASE_NAME} database`, true);
        return true;
    } catch (error) {
        log(`Connection to mongodb://${config.DATABASE_HOST}:${config.DATABASE_PORT}/${config.DATABASE_NAME} database failed`, true);
        log(`${error.name}: ${error.message}`, true);
        return false;
    }
}

/*
* Load JSON data from file.
* @param {String} filePath - Path to the JSON file.
* @returns {Object|Boolean} - Returns the parsed JSON object if successful, otherwise false
*/
const loadJsonData = async (filePath) => {
    log("INFO", "loadJsonData: filePath = " + filePath, true);

    try {
        return JSON.parse(await fs.promises.readFile(filePath));
    } catch (error) {
        log("saveTenantData(): Error reading file " + filePath + ". Error: " + error, true);
        return false;
    }
}

/*
* Load role permissions from file.
* @param {String} role - Role name (e.g., 'OVERSEER', 'ADMIN', 'WRITER', 'READER').
* @returns {Object|Boolean} - Returns the role permissions object if successful, otherwise false.
*/
const loadRolePermissions = async (role) => {
    log("INFO", "loadRolePermissions: role = " + role, true);
    switch (role) {
        case 'OVERSEER':
            return await loadJsonData(new URL('./initOverseerPermissions.json', import.meta.url));
        case 'ADMIN':
            return await loadJsonData(new URL('./initAdminPermissions.json', import.meta.url));
        case 'WRITER':
            return await loadJsonData(new URL('./initWriterPermissions.json', import.meta.url));
        case 'READER':
            return await loadJsonData(new URL('./initReaderPermissions.json', import.meta.url));
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
    log("INFO", "saveRoleData: roles = " + roles, true);
    if (!Array.isArray(roles)) return false;


    for (const roleData of roles) {

        const { name, role } = roleData;

        log("INFO", "saveRoleData: name = " + name, true);
        log("INFO", "saveRoleData: role = " + role, true);

        const rolePermissions = await loadRolePermissions(role);

        if (!rolePermissions) {
            log("ERROR", "saveRoleData(): Error loading role permissions for role " + role, true);
            return false;
        }

        //log("INFO", "saveRoleData: rolePermissions = " + JSON.stringify(rolePermissions, null, 2), true);


        for (const [feature, featureObj] of Object.entries(rolePermissions)) {
            log("INFO", `Feature: ${feature}`, true);
            for (const [permissionName, permissionDetails] of Object.entries(featureObj)) {
                //log("INFO", `  Permission: ${permissionName}, Details: ${JSON.stringify(permissionDetails)}`, true);
                /*
                log("INFO", `Permission: ${permissionName}:`, true);
                log("INFO", `  access: ${permissionDetails.access}`, true);
                log("INFO", `  adminTenantOnly: ${permissionDetails.adminTenantOnly}`, true);
                log("INFO", `  immutable: ${permissionDetails.immutable}`, true);
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
            log("ERROR", "saveRoleData(): error " + error.message, true);
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
    log("INFO", "saveTenantData(): tenant = " + JSON.stringify(tenants), true);

    for (const tenantData of tenants) {
        const { name, admin, active } = tenantData;

        log("INFO", "saveTenantData(): tenant name = " + name, true);
        log("INFO", "saveTenantData(): tenant admin = " + admin, true);
        log("INFO", "saveTenantData(): tenant active = " + active, true);

        try {
            const tenantModel = new Tenant({ name, admin, active });
            if (!tenantModel.save()) return false;
            return tenantModel;
        } catch (error) {
            log("ERROR", "saveTenantData(): error " + error.message, true);
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

    log("INFO", "saveUserData(): tenant = " + JSON.stringify(users), true);


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
            log("ERROR", "saveUserData(): error " + error.message, true);
            return false;
        }
    }

    return true;
}

if (config.INIT !== true) { // Skip init if not explicitly enabled in .env
    log("INFO", "Skip init. Use .env:  INIT = TRUE to continue.", true);
    process.exit(1);
}

(async () => {
    const connected = await connectMongoose();
    log("INFO", `connected = ${connected}`, true);
    if (!connected) process.exit(1); // 1 = error

    await saveRoleData(await loadJsonData(new URL('./initRoles.json', import.meta.url)));
    const tenantModel = await saveTenantData(await loadJsonData(new URL('./initTenants.json', import.meta.url)));
    await saveUserData(await loadJsonData(new URL('./initUsers.json', import.meta.url)), tenantModel);
    process.exit(0); // 0 = success
})();
