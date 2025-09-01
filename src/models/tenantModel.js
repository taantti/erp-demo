import mongoose from 'mongoose';

const newTenant = (req, allTenants = false) => {

}


const findTenant = (req, allTenants = false) => {

}

const findOneTenant = (req, allTenants = false) => {
    
}

const findTenantByIdAndDelete = (req, allTenants = false) => {
    
}

const findTenantById = (req, allTenants = false) => {
    
}

const TenantSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    admin: { type: Boolean, required: true },
    active: { type: Boolean, required: true },
});

const Tenant = mongoose.model('Tenant', TenantSchema);

export default Tenant;