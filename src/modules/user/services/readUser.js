import { User } from '../../../models/index.js';

export const readUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("id", id);
        const user = await User.findById(id);
        if(!user) return res.status(404).json({error: 'User not found'});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};


