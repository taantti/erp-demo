import config from './../../../config.js';
import bcrypt from "bcrypt";
import { User } from '../../../models/index.js';
import log from '../../../utils/logger.js';

export const createUser = async (req, res, next) => {
    log("INFO", "userService.js: createUser(): ", req);
    const {username, password, first_name: firstName, last_name: lastName, email, role, active} = req.body;
    const saltRounds = config.BCRYPT_SALT_ROUNDS | 10;

    try {
        
        //tenant = get from request user
        log("INFO", "username = " + username, req);
        log("INFO", "password = " + password, req);
        log("INFO", "firstName = " + firstName, req);
        log("INFO", "lastName = " + lastName, req);
        log("INFO", "email = " + email, req);
        log("INFO", "role = " + role, req);
        log("INFO", "active = " + active, req);

        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = new User({username, password: hashedPassword, first_name: firstName, last_name: lastName, email, role, active});
        return await user.save();
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    log("INFO", "userService.js: deleteUser(" + req.params.id + "): ", req);
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        return user;
    } catch (error) {
        next(error);
    }
};

export const readUser = async (req, res, next) => {
    log("INFO", "userService.js: readUser(" + req.params.id + "): ", req);
    try {
        return await User.findById(req.params.id);
    } catch (error) {
        next(error);
    }
};

export const readUsers = async (req, res, next) => {
    log("INFO", "userService.js: readUsers(): ", req);
    try {
        const ids = req.params.ids.split(',');
        log("INFO", "userService.js: readUsers(" + ids + "): ", req);
        return await User.find({ _id: { $in: ids } });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    log("INFO", "userService.js: updateUser(" + req.params.id + "): ", req);

        const {username, password, first_name: firstName, last_name: lastName, email, role, active} = req.body;
        const saltRounds = config.BCRYPT_SALT_ROUNDS | 10;
        const { id } = req.params;
    try {
        //tenant = get from request user
        log("INFO", "username = " + username, req);
        log("INFO", "password = " + password, req);
        log("INFO", "firstName = " + firstName, req);
        log("INFO", "lastName = " + lastName, req);
        log("INFO", "email = " + email, req);
        log("INFO", "role = " + role, req);
        log("INFO", "active = " + active, req);

        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = await User.findByIdAndUpdate(
            id,
            {username, password: hashedPassword, first_name: firstName, last_name: lastName, email, role, active},
            { new: true }
        );

        return user;

    } catch (error) {
        next(error);
    }
};


