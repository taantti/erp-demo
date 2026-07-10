import { Role } from "../../src/models/index.js";
import { User } from "../../src/models/index.js";
import { Tenant } from "../../src/models/index.js";
import { Stock } from "../../src/models/index.js";
import { Shelf } from "../../src/models/index.js";
import { Product } from "../../src/models/index.js";
import { ProductCategory } from "../../src/models/index.js";
import { Inventory } from "../../src/models/index.js";
import { StockEvent } from "../../src/models/index.js";
import { PurchaseOrder } from "../../src/models/index.js";
import { Customer } from "../../src/models/index.js";
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
            deleteInventory: { access: true, adminTenantOnly: false, immutable: false },
            readStockEvents: { access: true, adminTenantOnly: false, immutable: false },
            createStockEvent: { access: true, adminTenantOnly: false, immutable: false },
            readStockEvent: { access: true, adminTenantOnly: false, immutable: false },
            updateStockEvent: { access: true, adminTenantOnly: false, immutable: false },
            deleteStockEvent: { access: true, adminTenantOnly: false, immutable: false }
        },
        customer: {
            createCustomer: { access: true, adminTenantOnly: false, immutable: false },
            readCustomer: { access: true, adminTenantOnly: false, immutable: false },
            readCustomers: { access: true, adminTenantOnly: false, immutable: false },
            updateCustomer: { access: true, adminTenantOnly: false, immutable: false },
            deleteCustomer: { access: true, adminTenantOnly: false, immutable: false }
        },
        "purchaseOrder": {
            createPurchaseOrderItem: { access: true, adminTenantOnly: false, immutable: false },
            readPurchaseOrderItem: { access: true, adminTenantOnly: false, immutable: false },
            readPurchaseOrderItems: { access: true, adminTenantOnly: false, immutable: false },
            updatePurchaseOrderItem: { access: true, adminTenantOnly: false, immutable: false },
            deletePurchaseOrderItem: { access: true, adminTenantOnly: false, immutable: false },
            createPurchaseOrder: { access: true, adminTenantOnly: false, immutable: false },
            readPurchaseOrder: { access: true, adminTenantOnly: false, immutable: false },
            readPurchaseOrders: { access: true, adminTenantOnly: false, immutable: false },
            updatePurchaseOrder: { access: true, adminTenantOnly: false, immutable: false },
            deletePurchaseOrder: { access: true, adminTenantOnly: false, immutable: false }
        },
        "saleOrder": {
            createSaleOrderItem: { access: true, adminTenantOnly: false, immutable: false },
            readSaleOrderItem: { access: true, adminTenantOnly: false, immutable: false },
            readSaleOrderItems: { access: true, adminTenantOnly: false, immutable: false },
            updateSaleOrderItem: { access: true, adminTenantOnly: false, immutable: false },
            deleteSaleOrderItem: { access: true, adminTenantOnly: false, immutable: false },
            createSaleOrder: { access: true, adminTenantOnly: false, immutable: false },
            readSaleOrder: { access: true, adminTenantOnly: false, immutable: false },
            readSaleOrders: { access: true, adminTenantOnly: false, immutable: false },
            updateSaleOrder: { access: true, adminTenantOnly: false, immutable: false },
            deleteSaleOrder: { access: true, adminTenantOnly: false, immutable: false }
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
        active: true
    },
    {
        username: username_2,
        password: null,
        first_name: "Test2",
        last_name: "User2",
        email: "test2@example.com",
        role: "OVERSEER",
        active: true
    }
];

export const initProductCategoryData = [
    {
        name: "Test Category 1",
        slug: "test-category-1",
        active: true
    },
    {
        name: "Test Category 2",
        slug: "test-category-2",
        active: true
    }
];

export const initProductData = [
    {
        name: "Test Product 1",
        sku: "TEST-PRODUCT-1",
        unit: ProductUnits.PIECE,
        categoryIds: [],
        active: true
    },
    {
        name: "Test Product 2",
        sku: "TEST-PRODUCT-2",
        unit: ProductUnits.METER,
        categoryIds: [],
        active: true
    }
];

export const initStockData = [
    {
        name: "Test Stock 1",
        active: true
    },
    {
        name: "Test Stock 2",
        active: true
    }
];

export const initShelfData = [
    {
        stockId: null,
        name: "Test Shelf 1",
        code: "TEST-SHELF-1",
        active: true
    },
    {
        stockId: null,
        name: "Test Shelf 2",
        code: "TEST-SHELF-2",
        active: true
    }
];

export const initInventoryData = [
    {
        stockId: null,
        shelfId: null,
        productId: null,
        quantity: 100
    },
    {
        stockId: null,
        shelfId: null,
        productId: null,
        quantity: 200
    }
];


export const initPurchaseOrderItemData = [
    {
        productName: "Test purchase order item 1",
        quantity: 100,
        unitNetPrice: 100,
        unitGrossPrice: 125.5,
        vat: 25.5
    },
    {
        productName: "Test purchase order item 2",
        quantity: 200,
        unitNetPrice: 200,
        unitGrossPrice: 224,
        vat: 12
    }
];

export const initPurchaseOrderData = [
    {
        orderNumber: 1001,
        supplier: "Test supplier",
        notes: "Test notes 1"
    },
    {
        orderNumber: 1002,
        supplier: "Test supplier 2",
        notes: "Test notes 2"
    }
];

export const initCustomerData = [
    {
        first_name: "Test first name",
        last_name: " Test last name",
        active: true
    }
];

/**
 * Create a mock tenant for testing
 * @param {Object} [options={}] - Fields to override the defaults (e.g. name, active)
 * @returns {Promise<void>}
 */
export const createMockTenant = async (options = {}) => {
    const mockTenantData = { ...initTenantData, ...options };

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
 * @param {Object} [options={}] - Fields to override the defaults (e.g. name, role, rolePermission {})
 * @returns {Promise<void>}
 */
export const createMockRole = async (options = {}) => {
    const mockRoleData = { ...initRoleData, ...options };

    try {
        const roleModel = new Role(mockRoleData);
        await roleModel.save();
    } catch (error) {
        throw error;
    }
}

/**
 * Create a mock user for testing
 * @param {Object} [options={}] - Fields to override the defaults (e.g. username, password)
 * @returns {Promise<void>}
 */
export const createMockUser = async (options = {}) => {
    const hashedPassword = await hashPassword(password_1);
    const mockUserData = { ...initUserData[0], password: hashedPassword, tenant: mockTenantId, ...options };

    try {
        const userModel = new User(mockUserData);
        await userModel.save();
    } catch (error) {
        throw error;
    }
}

/**
 * Create a mock product category for testing
 * @param {Object} [options={}] - Fields to override the defaults (e.g. name, slug)
 * @returns {Promise<ProductCategory>}
 */
export const createMockProductCategory = async (options = {}) => {
    const mockCategoryData = { ...initProductCategoryData[0], tenant: mockTenantId, ...options };

    try {
        const categoryModel = new ProductCategory(mockCategoryData);
        return await categoryModel.save();
    } catch (error) {
        throw error;
    }
}

/**
 * Create a mock product for testing
 * @param {Object} [options={}] - Fields to override the defaults (e.g. name, sku, categoryIds)
 * @returns {Promise<Product>}
 */
export const createMockProduct = async (options = {}) => {
    const mockProductData = { ...initProductData[0], tenant: mockTenantId, ...options };

    try {
        const productModel = new Product(mockProductData);
        return await productModel.save();
    } catch (error) {
        throw error;
    }
}

/**
 * Create a mock stock for testing
 * @param {Object} [options={}] - Fields to override the defaults (e.g. name, active)
 * @returns {Promise<Stock>}
 */
export const createMockStock = async (options = {}) => {
    const mockStockData = { ...initStockData[0], tenant: mockTenantId, ...options };

    try {
        const stockModel = new Stock(mockStockData);
        return await stockModel.save();
    } catch (error) {
        throw error;
    }
}

/**
 * Create a mock shelf for testing
 * @param {Object} [options={}] - Fields to override the defaults (e.g. stockId, name).
 * @returns {Promise<Shelf>}
 */
export const createMockShelf = async (options = {}) => {
    const mockShelfData = { ...initShelfData[0], tenant: mockTenantId, ...options };

    try {
        const shelfModel = new Shelf(mockShelfData);
        return await shelfModel.save();
    } catch (error) {
        throw error;
    }
}

/**
 * Create a mock inventory for testing
 * @param {Object} [options={}] - Fields to override the defaults (e.g. stockId, shelfId, productId).
 * @returns {Promise<Inventory>}
 */
export const createMockInventory = async (options = {}) => {
    const mockInventoryData = { ...initInventoryData[0], tenant: mockTenantId, ...options };

    try {
        const inventoryModel = new Inventory(mockInventoryData);
        return await inventoryModel.save();
    } catch (error) {
        throw error;
    }
}

/**
 * Create a mock purchase order item (embedded supdocument - not persisted on its own).
 * @param {Object} [options={}] - Fields to override the defaults (e.g. productId, stockId, shelfId, quantity).
 * @returns {Object} - A plain purchase order item object.
 */
export const createMockPurchaseOrderItem = (options = {}) => {
    return { ...initPurchaseOrderItemData[0], ...options };
}

/**
 * Create a mock purchase order for testing. Provided items are run through
 * createMockPurchaseOrderItem() and embedded; if non is given one default item is used.
 * @param {Object} [options={}] - Fields to override the defaults (e.g. orderNumber, status).
 * @returns {Promise<Inventory>}
 */
export const createMockPurchaseOrder = async (options = {}) => {
    const items = (options.items ?? [{}]).map(item => createMockPurchaseOrderItem(item));
    const mockPurchaseOrderData = { ...initPurchaseOrderData[0], tenant: mockTenantId, ...options };

    try {
        const purchaseOrderModel = new PurchaseOrder(mockPurchaseOrderData);
        return await purchaseOrderModel.save();
    } catch (error) {
        throw error;
    }
}

/**
 * Create a mock customer for testing
 * @param {Object} [options={}] - Fields to override the defaults (e.g. first_name, last_name).
 * @returns {Promise<Customer>}
 */
export const createMockCustomer = async (options = {}) => {
    const mockCustomerData = { ...initCustomerData[0], tenant: mockTenantId, ...options };

    try {
        const customerModel = new Customer(mockCustomerData);
        return await customerModel.save();
    } catch (error) {
        throw error;
    }
}





