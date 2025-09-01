import { mongoose,  MongooseError } from 'mongoose';
export const roles = ['OVERSEER', 'ADMIN', 'WRITER', 'READER'];

const newRole = (req, allTenants = false) => {

}


const findRole = (req, allTenants = false) => {

}

const findOneRole = (req, allTenants = false) => {
    
}

const findRoleByIdAndDelete = (req, allTenants = false) => {
    
}

const findRoleById = (req, allTenants = false) => {
    
}

const PermissionSchema = new mongoose.Schema({   
    access: { type: Boolean, required: true },
    adminTenantOnly: { type: Boolean, required: true },
    immutable: { type: Boolean, required: true },
});

const RoleSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    role: { type: String, required: true, enum: roles },
    rolePermission: {
        product: { type: Map, of: PermissionSchema },
        role: { type: Map, of: PermissionSchema },
        tenant: { type: Map, of: PermissionSchema },
        user: { type: Map, of: PermissionSchema }
    }
});

export const Role = mongoose.model('Role', RoleSchema);

//export default Role;