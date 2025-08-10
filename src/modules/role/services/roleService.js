import { Role } from '../../../models/index.js';

export const createRole = async (req, res) => {
    console.log("roleService.js: createRole(): ");
    try {
        const {name, level} = req.body;
        const status = TRUE;
        console.log("name = " + name);
        console.log("level = " + level);
        const role = new Role({name, level});
        if(!role.save()) return false;
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};

export const readRole = async (req, res) => {
    console.log("roleService.js: readRole(" + req.params.id + "): ");
    try {
        return Role.findById(req.params.id);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};

export const readRoles = async (req, res) => {  
    try {
        const ids = req.params.ids.split(',');
        console.log("roleService.js: readRoles(" + ids + "): ");
        return await Role.find({ _id: { $in: ids } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateRole = async (req, res) => {
    console.log("roleService.js: updateRole(" + req.params.id + "): ");
    try {
         const {name, admin} = req.body;
        const { id } = req.params;
        console.log("id = " + id);
       
        console.log("name = " + name);
        console.log("level = " + level);

        const role = await Role.findByIdAndUpdate(
            id,
            {name, admin},
            { new: true }
        );

        return role;

    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};


export const deleteRole = async (req, res) => {
    console.log("roleService.js: deleteRole(" + req.params.id + "): ");
    try {
        const { id } = req.params;
        const role = await Role.findByIdAndDelete(id);
        return role;
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};





