//import express from 'express';
//import aux from "../../utils/auxiliary.js";

import userService from './services/index.js';

export const readUserReport =  (req, res) => {
    console.log("userReportService.readUserReport(): ");
};

export const readUsers = async (req, res) => {
    console.log("userService.readUsers(): ");
    //userService.readUsers(req, res);

    
    const users = await userService.readUsers(req, res);
    if (!users) return res.status(404).json({ error: 'Users not found' });
    res.status(200).json(users);
    

};

export const readUser = async (req, res) => {  
    const user = await userService.readUser(req, res);
    if(!user) return res.status(404).json({error: 'User not found'});
    res.status(200).json(user); 
};

export const createUser =  (req, res) => {
    console.log("userService.readUsers(): ");
    userService.createUser(req, res);
};

export const updateUser =  (req, res) => {
    console.log("userService.readUsers(): ");
    userService.updateUser(req, res);
};

export const deleteUser =  (req, res) => {
    console.log("userService.deleteUser(): ");
    userService.deleteUser(req, res);
};























