import { Role } from "../../src/models/index.js";
import { User } from "../../src/models/index.js";
import { Tenant } from "../../src/models/index.js";
import { Stock } from "../../src/models/index.js";
import { Shelf } from "../../src/models/index.js";
import { Product } from "../../src/models/index.js";
import { ProductCategory } from "../../src/models/index.js";
import { hashPassword } from "../../src/utils/password.js";
import { ProductUnits } from '../../src/models/productModel.js';

export const username_1 = "mock-user-1";
export const password_1 = "Mock-Password123!-1";

export const username_2 = "mock-user-2";
export const password_2 = "Mock-Password123!-2";


export let mockTenantId = null;

export const initTenantData = {
    name: "test-tenant",
    admin: false,
    active: true
};

export const initRoleData = {
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
            deleteShelf: { access: true, adminTenantOnly: false, immutable: false },
            readInventories: { access: true, adminTenantOnly: false, immutable: false },
            createInventory: { access: true, adminTenantOnly: false, immutable: false },
            readInventory: { access: true, adminTenantOnly: false, immutable: false },
            updateInventory: { access: true, adminTenantOnly: false, immutable: false },
            deleteInventory: { access: true, adminTenantOnly: false, immutable: false }
        }
    }
};

export const initUserData = [
    {
        username: username_1,
        password: null,
        first_name: "Test-1",
        last_name: "User-1",
        email: "test1@example.com",
        role: "OVERSEER",
        active: true,
        tenant: null
    },
    {
        username: username_2,
        password: null,
        first_name: "Test2",
        last_name: "User2",
        email: "test2@example.com",
        role: "OVERSEER",
        active: true,
        tenant: null
    }
];

export const initProductCategoryData = [
    {
        name: "Test Category 1",
        slug: "test-category-1",
        active: true,
        tenant: null
    },
    {
        name: "Test Category 2",
        slug: "test-category-2",
        active: true,
        tenant: null
    }
];

export const initProductData = [
    {
        name: "Test Product 1",
        sku: "TEST-PRODUCT-1",
        unit: ProductUnits.PIECE,
        categoryIds: [],
        active: true,
        tenant: null
    },
    {
        name: "Test Product 2",
        sku: "TEST-PRODUCT-2",
        unit: ProductUnits.METER,
        categoryIds: [],
        active: true,
        tenant: null
    }
];

export const initStockData = [
    {
        name: "Test Stock 1",
        active: true,
        tenant: null
    },
    {
        name: "Test Stock 2",
        active: true,
        tenant: null
    }
];

export const initShelfData = [
    {
        stockId: null,
        name: "Test Shelf 1",
        code: "TEST-SHELF-1",
        active: true,
        tenant: null
    },
    {
        stockId: null,
        name: "Test Shelf 2",
        code: "TEST-SHELF-2",
        active: true,
        tenant: null
    }
];

/**
 * Create a mock tenant for testing
 * @param {Object} tenantData - (Optional) Tenant data to override defaults
 * @returns {Promise<void>}
 */
export const createMockTenant = async (tenantData = {}) => {
    const mockTenantData = { ...initTenantData, ...tenantData };

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
 * @param {Object} roleData - (Optional) Role data to override defaults.
 * @returns {Promise<void>}
 */
export const createMockRole = async (roleData = {}) => {
    const mockRoleData = { ...initRoleData, ...roleData };

    try {
        const roleModel = new Role(mockRoleData);
        await roleModel.save();
    } catch (error) {
        throw error;
    }
}

/**
 * Create a mock user for testing
 * @param {Object} userData - (Optional) User data to override defaults.
 * @returns {Promise<void>}
 */
export const createMockUser = async (userData = {}) => {
    const hashedPassword = await hashPassword(password_1);
    const mockUserData = { ...initUserData[0], password: hashedPassword, tenant: mockTenantId, ...userData };

    try {
        const userModel = new User(mockUserData);
        await userModel.save();
    } catch (error) {
        throw error;
    }
}

/**
 * Create a mock product category for testing
 * @param {Object} productCategoryData - (Optional) Product category data to override defaults.
 * @returns {Promise<ProductCategory>}
 */
export const createMockProductCategory = async (productCategoryData = {}) => {
    const mockCategoryData = { ...initProductCategoryData[0], tenant: mockTenantId, ...productCategoryData };

    try {
        const categoryModel = new ProductCategory(mockCategoryData);
        return await categoryModel.save();
    } catch (error) {
        throw error;
    }
}

/**
 * Create a mock product for testing
 * @param {array} categoryIds - The IDs of the categories.
 * @param {Object} productData - (Optional) Product data to override defaults.
 * @returns {Promise<Product>}
 */
export const createMockProduct = async (categoryIds = [], productData = {}) => {
    const mockProductData = { ...initProductData[0], categoryIds: categoryIds, tenant: mockTenantId, ...productData };

    try {
        const productModel = new Product(mockProductData);
        return await productModel.save();
    } catch (error) {
        throw error;
    }
}

/**
 * Create a mock stock for testing
 * @param {Object} stockData - (Optional) Stock data to override defaults
 * @returns {Promise<Stock>}
 */
export const createMockStock = async (stockData = {}) => {
    const mockStockData = { ...initStockData[0], tenant: mockTenantId, ...stockData };

    try {
        const stockModel = new Stock(mockStockData);
        return await stockModel.save();
    } catch (error) {
        throw error;
    }
}

/**
 * Create a mock shelf for testing
 * @param {string} stockId - The ID of the stock.
 * @param {Object} shelfData - (Optional) Shelf data to override defaults.
 * @returns {Promise<Shelf>}
 */
export const createMockShelf = async (stockId, shelfData = {}) => {
    const mockShelfData = { ...initShelfData[0], stockId: stockId, tenant: mockTenantId, ...shelfData };

    try {
        const shelfModel = new Shelf(mockShelfData);
        return await shelfModel.save();
    } catch (error) {
        throw error;
    }
}