//import express from 'express';
//import aux from "../../utils/auxiliary.js";

import userService from './services/index.js';

export const readUserReport =  (req, res) => {
    console.log("userReportService.readUserReport(): ");
    //userReportService.readUserReport(req, res);
};

export const readUser =  (req, res) => {
    userService.readUser(req, res);
    console.log("userService.readUser(" + req.params.id + "): ");
};

export const readUsers =  (req, res) => {
    console.log("userService.readUserReport(): ");
    //userService.readUsers(req, res);
};

export const createUser =  (req, res) => {
    console.log("userService.readUserReport(): ");
    //userService.createUser(req, res);
};

export const updateUser =  (req, res) => {
    console.log("userService.readUserReport(): ");
    //userService.updateUser(req, res);
};

export const deleteUser =  (req, res) => {
    console.log("userService.deleteUser(): ");
    //userService.deleteUser(req, res);
};























