import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
    name: String,
    admin: Boolean,
    active: Boolean
});

const Tenant = mongoose.model('Tenant', tenantSchema);

export default Tenant;