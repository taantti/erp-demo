import { User } from '../../../models/index.js';

export const readUserReport = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if(!user) return res.status(404).json({error: 'User not found'});
        res.status(200).json(`User ${user.name} report`);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};