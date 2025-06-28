export const updateUser = async (req, res) => {
    try {
        res.status(501).json({ message: 'Not Implemented yet'});
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};