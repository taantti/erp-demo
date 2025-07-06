import { User } from '../../../models/index.js';

export const createUser = async (req, res) => {
    console.log("userService.js: createUser(): ");
    try {
        res.status(501).json({ message: 'Not Implemented yet'});
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};

export const deleteUser = async (req, res) => {
    console.log("userService.js: deleteUser(" + req.params.id + "): ");
    try {
        res.status(501).json({ message: 'Not Implemented yet'});
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};

export const readUser = async (req, res) => {
    console.log("userService.js: readUser(" + req.params.id + "): ");
    try {
        return User.findById(req.params.id);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};

export const readUsers = async (req, res) => {  
    try {
        const ids = req.params.ids.split(',');
        console.log("userService.js: readUsers(" + ids + "): ");
        return await User.find({ _id: { $in: ids } });


        //const users = await User.find({ _id: { $in: ids } });
        //if (!users) return res.status(404).json({ error: 'Users not found' });
        //res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req, res) => {
    console.log("userService.js: updateUser(" + req.params.id + "): ");
    try {
        res.status(501).json({ message: 'Not Implemented yet'});
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};


