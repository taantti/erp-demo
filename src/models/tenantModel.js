import mongoose from 'mongoose';

const TenantSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    admin: { type: Boolean, required: true },
    active: { type: Boolean, required: true },
});

const Tenant = mongoose.model('Tenant', TenantSchema);

export default Tenant;