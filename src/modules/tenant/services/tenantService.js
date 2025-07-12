import { Tenant } from '../../../models/index.js';
import { User } from '../../../models/index.js';

export const createTenant = async (req, res) => {
    console.log("tenantService.js: createUser(): ");
    try {
        const {name, admin, first_name, last_name, username, password} = req.body;
        const status = TRUE;
        console.log("name = " + name);
        console.log("admin = " + admin);
        console.log("status = " + status);
        const tenant = new Tenant({name, admin, status})
        //return tenant.save();
        if(!tenant.save()) return false;

        console.log("first_name = " + first_name);
        console.log("last_name = " + last_name);
        console.log("username = " + username);
        console.log("password = " + password);


        //const user = new User({username, password, first_name, last_name, email, "ADMIN", TRUE, tenant['_id']});
        //if(!user.save()) return false;

        const newTenantAndUser = {};



    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};

export const deleteTenant = async (req, res) => {
    console.log("tenantService.js: deleteUser(" + req.params.id + "): ");
    try {
        //res.status(501).json({ message: 'Not Implemented yet'});
        const { id } = req.params;
        const tenant = await Tenant.findByIdAndDelete(id);
        return tenant;
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};

export const readTenant = async (req, res) => {
    console.log("tenantService.js: readUser(" + req.params.id + "): ");
    try {
        return Tenant.findById(req.params.id);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};

export const readTenants = async (req, res) => {  
    try {
        const ids = req.params.ids.split(',');
        console.log("tenantService.js: readUsers(" + ids + "): ");
        return await Tenant.find({ _id: { $in: ids } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateTenant = async (req, res) => {
    console.log("tenantService.js: updateUser(" + req.params.id + "): ");
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
        res.status(500).json({ error: error.message});
    }
};


