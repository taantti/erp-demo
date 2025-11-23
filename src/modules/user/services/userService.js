import config from './../../../config.js';
import bcrypt from "bcrypt";
import { findUsers, findUserById, newUser, findOneUserAndUpdate, User } from '../../../models/index.js';
import { log } from '../../../utils/logger.js';
import { getRelativePath } from '../../../utils/auxiliary.js';
import { sanitizeObjectFields } from '../../../utils/sanitization.js';

const relativePath = getRelativePath(import.meta.url);

export const createUser = async (req, res, next) => {
    log("INFO", `${relativePath}: createUser(): `, true, req);

    log("INFO", `${relativePath}: createUser(): ${JSON.stringify(req.body)}`, true, req);

    try {
        const user = await newUser(req, req.body, false, true, true);
        return user;
    } catch (error) {
        next(error);
    }
};

export const readUser = async (req, res, next) => {
    log("INFO", `${relativePath}: readUser(${req.params.id}): `, true, req);
    //return next(Object.assign(new Error(`Tööt Error`), { statusCode: 401 }));
    try {
        //return next(Object.assign(new Error(`Tööt Error`), { statusCode: 401 }));
        const user = await findUserById(req, req.params.id, false, true, true);
        return user;
    } catch (error) {
        return next(error);
    }
};

export const readUsers = async (req, res, next) => {
    log("INFO", `${relativePath}: readUsers(): `, true, req);

    try {
        const users = await findUsers(req, req.query, false, true, true);
        return users;
    } catch (error) {
        return next(error);
    }
};

export const updateUser = async (req, res, next) => {
    log("INFO", `${relativePath}: updateUser(${req.params.id}): `, true, true, req);
    try {

        req.body = sanitizeObjectFields(req.body, ['username', 'password', 'tenant']); // These fields cannot be updated here.
        const user = await findOneUserAndUpdate(req, req.params.id, req.body, false, true, true);

        return user;

    } catch (error) {
        next(error);
    }
};

// PUT /user/:id/password
export const updatePassword = async (req, res, next) => {
     log("INFO", `${relativePath}: updatePassword(${req.params.id}): `, true, true, req);
    try {
        if (req.user.username !== req.body.username) {
            log("CRITICAL", `${relativePath}: ${req.user.username} is not allowed to change password for ${req.body.username}`, true, req);
            return next(Object.assign(new Error("Unauthorized"), { statusCode: 401 }));
        }
        if (!req.body.password || !req.body.new_password) {
            return next(Object.assign(new Error("Bad Request. Current and new passwords are required."), { statusCode: 400 }));
        }
        
        const user = await findUserById(req, req.params.id, false, true, true);
        if (!user) return false;


        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return next(Object.assign(new Error("Unauthorized"), { statusCode: 401 }));
        }

        const saltRounds = config.BCRYPT_SALT_ROUNDS | 10;
        const hashedPassword = bcrypt.hashSync(req.body.new_password, saltRounds);
        user.password = hashedPassword;
        if (!await user.save()) return false;

        return true;

    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    log("INFO", `${relativePath}: deleteUser(${req.params.id}): `, true, req);
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        return user;
    } catch (error) {
        next(error);
    }
};






