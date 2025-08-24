import mongoose, { MongooseError } from 'mongoose';

const PermissionSchema = new mongoose.Schema({   
    access: { type: Boolean, required: true },
    adminTenantOnly: { type: Boolean, required: true },
    immutable: { type: Boolean, required: true },
});

const RoleSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    role: { type: String, required: true, enum: ['OVERSEER', 'ADMIN', 'WRITER', 'READER'] },
    rolePermission: {
        product: { type: Map, of: PermissionSchema },
        role: { type: Map, of: PermissionSchema },
        tenant: { type: Map, of: PermissionSchema },
        user: { type: Map, of: PermissionSchema }
    }
});

const Role = mongoose.model('Role', RoleSchema);

export default Role;