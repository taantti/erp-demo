import { Tenant } from '../../../models/index.js';
import { User } from '../../../models/index.js';

export const createTenant = async (req, res, next) => {
    console.log("tenantService.js: createTenant(): ");
    try {
        const {name, admin, first_name, last_name, username, password} = req.body;
        const status = TRUE;
        console.log("name = " + name);
        console.log("admin = " + admin);
        console.log("status = " + status);
        const tenant = new Tenant({name, admin, status})
        //return tenant.save();
        if(!await tenant.save()) return false;

        console.log("first_name = " + first_name);
        console.log("last_name = " + last_name);
        console.log("username = " + username);
        console.log("password = " + password);
    } catch (error) {
        next(error);
    }
};

export const deleteTenant = async (req, res, next) => {
    console.log("tenantService.js: deleteTenant(" + req.params.id + "): ");
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
    console.log("tenantService.js: readTenant(" + req.params.id + "): ");
    try {
        return await Tenant.findById(req.params.id);
    } catch (error) {
        next(error);
    }
};

export const readTenants = async (req, res, next) => {
    try {
        const ids = req.params.ids.split(',');
        console.log("tenantService.js: readTenants(" + ids + "): ");
        return await Tenant.find({ _id: { $in: ids } });
    } catch (error) {
        next(error);
    }
};

export const updateTenant = async (req, res, next) => {
    console.log("tenantService.js: updateTenant(" + req.params.id + "): ");
    try {
         const {name, admin} = req.body;
        const { id } = req.params;
        console.log("id = " + id);
       
        console.log("name = " + name);
        console.log("admin = " + admin);

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


