import { Tenant } from '../../../models/index.js';
import { User } from '../../../models/index.js';
import { log } from '../../../utils/logger.js';

export const createTenant = async (req, res, next) => {
    log("INFO", "tenantService.js: createTenant(): ", req);
    try {
        const {name, admin, first_name, last_name, username, password} = req.body;
        const status = TRUE;
        log("INFO", "name = " + name, req);
        log("INFO", "admin = " + admin, req);
        log("INFO", "status = " + status, req);
        const tenant = new Tenant({name, admin, status})
        //return tenant.save();
        if(!await tenant.save()) return false;

        log("INFO", "first_name = " + first_name, req);
        log("INFO", "last_name = " + last_name, req);
        log("INFO", "username = " + username, req);
        log("INFO", "password = " + password, req);
    } catch (error) {
        next(error);
    }
};

export const deleteTenant = async (req, res, next) => {
    log("INFO", "tenantService.js: deleteTenant(" + req.params.id + "): ", req);
    try {
        //res.status(501).json({ message: 'Not Implemented yet'});
        const { id } = req.params;
        const tenant = await Tenant.findByIdAndDelete(id);
        return tenant;
    } catch (error) {
        next(error);
    }
};

export const readTenant = async (req, res, next) => {
    log("INFO", "tenantService.js: readTenant(" + req.params.id + "): ", req);
    try {
        return await Tenant.findById(req.params.id);
    } catch (error) {
        next(error);
    }
};

export const readTenants = async (req, res, next) => {
    log("INFO", "tenantService.js: readTenants(): ", req);
    try {
        const ids = req.params.ids.split(',');
        log("INFO", "tenantService.js: readTenants(" + ids + "): ", req);
        return await Tenant.find({ _id: { $in: ids } });
    } catch (error) {
        next(error);
    }
};

export const updateTenant = async (req, res, next) => {
    log("INFO", "tenantService.js: updateTenant(" + req.params.id + "): ", req);
    try {
         const {name, admin} = req.body;
        const { id } = req.params;
        log("INFO", "id = " + id, req);

        log("INFO", "name = " + name, req);
        log("INFO", "admin = " + admin, req);

        const tenant = await Tenant.findByIdAndUpdate(
            id,
            {name, admin},
            { new: true }
        );

        return tenant;

    } catch (error) {
        next(error);
    }
};


