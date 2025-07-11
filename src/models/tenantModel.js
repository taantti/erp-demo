import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
    name: String,
    admin: Boolean
});

export default Tenant;