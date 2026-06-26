import { Role } from "../../src/models/index.js";
import { User } from "../../src/models/index.js";
import { Tenant } from "../../src/models/index.js";
import { ProductCategory } from "../../src/models/index.js";
import { hashPassword } from "../../src/utils/password.js";

export const username = "test-user";
export const password = "Test-Password123!";
export let mockTenantId = null;

/**
 * Create a mock tenant for testing
 * @returns {Promise<void>}
 */
export const createMockTenant = async () => {
    const mockTenantData = {
        name: "test-tenant",
        admin: false,
        active: true
    }

    try {
        const tenantModel = new Tenant(mockTenantData);
        await tenantModel.save();
        mockTenantId = tenantModel._id;
    } catch (error) {
        throw error;
    }
}

/**
 * Create a mock role and permissions for testing
 * @returns {Promise<void>}
 */
export const createMockRole = async () => {
    const mockRoleData = {
        name: "test-role",
        role: "OVERSEER",
        rolePermission: {
            user: {
                createUser: { access: true, immutable: false, adminTenantOnly: false },
                readUsers: { access: true, immutable: false, adminTenantOnly: false },
                readUser: { access: true, immutable: false, adminTenantOnly: false },
                updateUser: { access: true, immutable: false, adminTenantOnly: false },
                deleteUser: { access: true, immutable: false, adminTenantOnly: false },
                updateUserPassword: { access: true, immutable: false, adminTenantOnly: false }
            },
            productCategory: {
                createProductCategory: { access: true, immutable: false, adminTenantOnly: false },
                readProductCategories: { access: true, immutable: false, adminTenantOnly: false },
                readProductCategory: { access: true, immutable: false, adminTenantOnly: false },
                updateProductCategory: { access: true, immutable: false, adminTenantOnly: false },
                deleteProductCategory: { access: true, immutable: false, adminTenantOnly: false }
            },
            product: {
                createProduct: { access: true, adminTenantOnly: false, immutable: false },
                readProduct: { access: true, adminTenantOnly: false, immutable: false },
                readProducts: { access: true, adminTenantOnly: false, immutable: false },
                updateProduct: { access: true, adminTenantOnly: false, immutable: false },
                deleteProduct: { access: true, adminTenantOnly: false, immutable: false }
            },
            stock: {
                createStock: { access: true, adminTenantOnly: false, immutable: false },
                readStock: { access: true, adminTenantOnly: false, immutable: false },
                readStocks: { access: true, adminTenantOnly: false, immutable: false },
                updateStock: { access: true, adminTenantOnly: false, immutable: false },
                deleteStock: { access: true, adminTenantOnly: false, immutable: false },
                createShelf: { access: true, adminTenantOnly: false, immutable: false },
                readShelf: { access: true, adminTenantOnly: false, immutable: false },
                readShelves: { access: true, adminTenantOnly: false, immutable: false },
                updateShelf: { access: true, adminTenantOnly: false, immutable: false },
                deleteShelf: { access: true, adminTenantOnly: false, immutable: false }
            }
        }
    }

    try {
        const roleModel = new Role(mockRoleData);
        await roleModel.save();
    } catch (error) {
        throw error;
    }
}

/**
 * Create a mock user for testing
 * @returns {Promise<void>}
 */
export const createMockUser = async () => {

    const hashedPassword = await hashPassword(password);

    const mockUserData = {
        username: username,
        password: hashedPassword,
        first_name: "Test",
        last_name: "User",
        email: "test@example.com",
        role: "OVERSEER",
        active: true,
        tenant: mockTenantId
    }
    try {
        const userModel = new User(mockUserData);
        await userModel.save();
    } catch (error) {
        throw error;
    }
}

/**
 * Create a mock product category for testing
 * @returns {Promise<ProductCategory>}
 */
export const createMockProductCategory = async () => {
    const mockCategoryData = {
        name: "Test Category",
        slug: "test-category",
        active: true,
        tenant: mockTenantId
    };

    try {
        const categoryModel = new ProductCategory(mockCategoryData);
        return await categoryModel.save();
    } catch (error) {
        throw error;
    }
}