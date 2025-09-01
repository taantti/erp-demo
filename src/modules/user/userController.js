//import aux from "../../utils/auxiliary.js";

import userService from './services/index.js';

export const readUserReport =  (req, res) => {
    console.log("userReportService.readUserReport(): ");
};

export const readUsers = async (req, res) => {
    console.log("userService.readUsers(): "); 
    const users = await userService.readUsers(req, res);
    if (!users) return res.status(404).json({ error: 'Users not found' });
    res.status(200).json(users);
};

export const readUser = async (req, res) => {  
    const user = await userService.readUser(req, res);
    if(!user) return res.status(404).json({error: 'User not found'});
    res.status(200).json(user); 
};

export const createUser = async (req, res) => {
    console.log("userService.readUsers(): ");
    const newUser = await userService.createUser(req, res);
    if(!newUser) return res.status(404).json({error: 'User not created'});
    res.status(201).json(newUser);
};

export const updateUser = async (req, res) => {
    console.log("userService.updateUser(): ");
    const updatedUser = await userService.updateUser(req, res);
    if(!updatedUser) res.status(404).json({error: 'User not found'});
    res.status(201).json(updatedUser);
};

export const deleteUser = async (req, res) => {
    console.log("userService.deleteUser(): ");
    const deletedUser = userService.deleteUser(req, res);
    if(!deletedUser) res.status(404).json({error: 'User not found'});
    res.status(200).json({msg: 'User deleted'});
};























