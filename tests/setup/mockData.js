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
import mockData  from "./mockData/index.js";

export let mockTenantId = null;

/**
 * Create a mock tenant for testing
 * @param {Object} [options={}] - Fields to override the defaults (e.g. name, active)
 * @returns {Promise<void>}
 */
export const createMockTenant = async (options = {}) => {
    const mockTenantData = { ...mockData.tenant[0], ...options };

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
    const mockRoleData = { ...mockData.role[0], ...options };

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
    const hashedPassword = await hashPassword(mockData.user[0].password);
    const mockUserData = { ...mockData.user[0], password: hashedPassword, tenant: mockTenantId, ...options };

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
    const mockCategoryData = { ...mockData.productCategory[0], tenant: mockTenantId, ...options };

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
    const mockProductData = { ...mockData.product[0], tenant: mockTenantId, ...options };

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
    const mockStockData = { ...mockData.stock[0], tenant: mockTenantId, ...options };

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
    const mockShelfData = { ...mockData.shelf[0], tenant: mockTenantId, ...options };

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
    const mockInventoryData = { ...mockData.inventory[0], tenant: mockTenantId, ...options };

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
    return { ...mockData.purchaseOrderItem[0], ...options };
}

/**
 * Create a mock purchase order for testing. Provided items are run through
 * createMockPurchaseOrderItem() and embedded; if non is given one default item is used.
 * @param {Object} [options={}] - Fields to override the defaults (e.g. orderNumber, status).
 * @returns {Promise<Inventory>}
 */
export const createMockPurchaseOrder = async (options = {}) => {
    const items = (options.items ?? [{}]).map(item => createMockPurchaseOrderItem(item));
    const mockPurchaseOrderData = { ...mockData.purchaseOrder[0], items: items, tenant: mockTenantId, ...options };

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
    const mockCustomerData = { ...mockData.customer[0], tenant: mockTenantId, ...options };

    try {
        const customerModel = new Customer(mockCustomerData);
        return await customerModel.save();
    } catch (error) {
        throw error;
    }
}





