//import express from 'express';
//import aux from "../../utils/auxiliary.js";

import roleService from './services/index.js';


export const readRoles = async (req, res) => {
    const roles = await roleService.readRoles(req, res);
    if (!roles) return res.status(404).json({ error: 'Role not found' });
    res.status(200).json(roles);
};

export const readRole = async (req, res) => {  
    const role = await roleService.readRole(req, res);
    if(!role) return res.status(404).json({error: 'Role not found'});
    res.status(200).json(role); 
};

export const createRole = async (req, res) => {
    const newRole = await roleService.createRole(req, res);
    if(!newRole) return res.status(404).json({error: 'Role not created'});
    res.status(201).json(newRole);
};

export const updateRole = async (req, res) => {
    const updatedRole = await roleService.updateRole(req, res);
    if(!updatedRole) res.status(404).json({error: 'Role not found'});
    res.status(201).json(updatedRole);
};

export const deleteRole =  (req, res) => {
    const deletedRole = roleService.deleteRole(req, res);
    if(!deletedRole) res.status(404).json({error: 'Role not found'});
    res.status(404).json({error: 'Role deleted'});
};























