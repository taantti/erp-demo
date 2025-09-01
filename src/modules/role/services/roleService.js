import { Role } from '../../../models/index.js';
import log from '../../../utils/logger.js';

export const createRole = async (req, res, next) => {
    log("INFO", "roleService.js: createRole(): ", req);
    try {
        const {name, level} = req.body
        const status = TRUE;
        log("INFO", "name = " + name, req);
        log("INFO", "level = " + level, req);
        const role = new Role({name, level});
        if(!await role.save()) return false;
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};

export const readRole = async (req, res, next) => {
    log("INFO", "roleService.js: readRole(" + req.params.id + "): ", req);
    try {
        return await Role.findById(req.params.id);
    } catch (error) {
        next(error);
    }
};

export const readRoles = async (req, res, next) => {
    log("INFO", "roleService.js: readRoles(): ", req);
    try {
        const ids = req.params.ids.split(',');
        log("INFO", "roleService.js: readRoles(" + ids + "): ", req);
        return await Role.find({ _id: { $in: ids } });
    } catch (error) {
        next(error);
    }
};

export const updateRole = async (req, res, next) => {
    log("INFO", "roleService.js: updateRole(" + req.params.id + "): ", req);
    try {
         const {name, admin} = req.body;
        const { id } = req.params;
        log("INFO", "id = " + id);

        log("INFO", "name = " + name);
        log("INFO", "role = " + role);

        const role = await Role.findByIdAndUpdate(
            id,
            {role, role},
            { new: true }
        );

        return role;

    } catch (error) {
        next(error);
    }
};


export const deleteRole = async (req, res, next) => {
    log("INFO", "roleService.js: deleteRole(" + req.params.id + "): ", req);
    try {
        const { id } = req.params;
        const role = await Role.findByIdAndDelete(id);
        return role;
    } catch (error) {
        next(error);
    }
};





