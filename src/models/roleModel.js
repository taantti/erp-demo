import mongoose, { MongooseError } from 'mongoose';

const featurePermissionSchema = new mongoose.Schema({
    feature: { type: String, required: true, minlength: 3, maxlength: 30 },
    access: { type: Boolean, required: true },
    adminTenantOnly: { type: Boolean, required: true },
    immutable: { type: Boolean, required: true },
});

const modulePermission = new mongoose.Schema({
    module: { 
        type: String, 
        required: true, 
        minlength: 3, 
        maxlength: 60,
        enum: [
            'product', 
            'role', 
            'tenant', 
            'user'
        ]
    },
    features: [featurePermissionSchema]        
});

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    role: { type: String, required: true, enum: ['OVERSEER', 'ADMIN', 'WRITER', 'READER']},
    permissions: [modulePermission]
});

const Role = mongoose.model('Role', roleSchema);

export default Role;