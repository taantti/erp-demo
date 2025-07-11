//import express from 'express';
//import aux from "../../utils/auxiliary.js";

import tenantService from './services/index.js';


export const readTenants = async (req, res) => {
    const users = await tenantService.readTenants(req, res);
    if (!users) return res.status(404).json({ error: 'Tenants not found' });
    res.status(200).json(users);
};

export const readTenant = async (req, res) => {  
    const user = await tenantService.readTenant(req, res);
    if(!user) return res.status(404).json({error: 'Tenant not found'});
    res.status(200).json(user); 
};

export const createTenant = async (req, res) => {
    const newUser = await tenantService.createTenant(req, res);
    if(!newUser) return res.status(404).json({error: 'Tenant not created'});
    res.status(201).json(newUser);
};

export const updateTenant = async (req, res) => {
    const updatedUser = await tenantService.updateTenant(req, res);
    if(!updatedUser) res.status(404).json({error: 'Tenant not found'});
    res.status(201).json(updatedUser);
};

export const deleteTenant =  (req, res) => {
    const deletedUser = tenantService.deleteTenant(req, res);
    if(!deletedUser) res.status(404).json({error: 'Tenant not found'});
    res.status(404).json({error: 'Tenant deleted'});
};























