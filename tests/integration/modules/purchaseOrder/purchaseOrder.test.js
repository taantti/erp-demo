import app from "../../../../src/app.js";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setup, teardown } from "../../../setup/db.js";
import request from 'supertest';
import {
    createMockTenant, createMockRole, createMockUser,
    createMockStock, createMockShelf, createMockProductCategory, createMockProduct, initProductData
} from "../../../setup/mockData.js";

import { login } from "../../../setup/login.js";
import { PurchaseOrderStatuses } from '../../../../src/models/purchaseOrderModel.js';

let jwtToken = null;
let purchaseOrderData = null;
let createdPurchaseOrderId = null;
let purchaseOrderItemData = null;
let createdPurchaseOrderItemId = null;
let mockStockId = null;
let mockShelfId = null;
let mockProductCategoryId = null;
let mockProductId1 = null;
let mockProductId2 = null;

/**
 * Create mock data for testing
 * @returns {Promise<void>}
 */
const createMockData = async () => {
    try {
        await createMockTenant();
        await createMockRole();
        await createMockUser();
        mockStockId = (await createMockStock())._id;
        mockShelfId = (await createMockShelf({ stockId: mockStockId }))._id;
        mockProductCategoryId = (await createMockProductCategory())._id;
        mockProductId1 = (await createMockProduct({ ...initProductData[0], categoryIds: [mockProductCategoryId] }))._id;
        mockProductId2 = (await createMockProduct({ ...initProductData[1], categoryIds: [mockProductCategoryId] }))._id;
    } catch (error) {
        console.error('MOCK DATA FAILED:', error);
        throw error;
    }
}

/**
 * Set up test environment
 * @returns {Promise<void>}
 */
beforeAll(async () => {
    await setup();
    await createMockData();
    jwtToken = (await login()).body.login;
})

/**
 * Clean up test environment
 * @returns {Promise<void>}
 */
afterAll(async () => {
    await teardown();
})

/**
 * Test purchase order creation endpoint
 * @returns {Promise<void>}
 */
describe('POST /purchase-order', () => {
    it('should create new purchase order', async () => {
        purchaseOrderData = {
            orderNumber: 1000,
            supplier: "Test supplier",
            status: PurchaseOrderStatuses.DRAFT,
            items: [
                {
                    productName: "Test product name",
                    productId: mockProductId1,
                    stockId: mockStockId,
                    shelfId: mockShelfId,
                    quantity: 100,
                    unitNetPrice: 100,
                    unitGrossPrice: 125.5,
                    vat: 25.5,
                    receivedQuantity: 0
                }
            ],
            notes: "Test note",
        };

        const response = await request(app).post("/purchase-order").set('Authorization', `Bearer ${jwtToken}`).send(purchaseOrderData);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        createdPurchaseOrderId = response.body._id;
    })
})

/**
 * Test purchase order retrieval endpoint
 * @returns {Promise<void>}
 */
describe('GET /purchase-order/:id', () => {
    it('should get purchase order by id', async () => {
        const response = await request(app).get("/purchase-order/" + createdPurchaseOrderId).set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
    })
})

/**
 * Test purchase order update endpoint
 * @returns {Promise<void>}
 */
describe('PUT /purchase-order/:id', () => {
    it('should update purchase order', async () => {
        purchaseOrderData.notes = "Updated Test note.";
        const response = await request(app).put("/purchase-order/" + createdPurchaseOrderId).set('Authorization', `Bearer ${jwtToken}`).send(purchaseOrderData);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
    })
})

/**
 * Test purchase order item creation endpoint
 * @returns {Promise<void>}
 */
describe('POST /purchase-order/item', () => {
    it('should create new purchase order item', async () => {
        purchaseOrderItemData = {
            productName: "Test product name 2",
            productId: mockProductId2,
            stockId: mockStockId,
            shelfId: mockShelfId,
            quantity: 101,
            unitNetPrice: 200,
            unitGrossPrice: 251,
            vat: 25.5,
            receivedQuantity: 0
        };

        const response = await request(app).post("/purchase-order/" + createdPurchaseOrderId + "/item").set('Authorization', `Bearer ${jwtToken}`).send(purchaseOrderItemData);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        createdPurchaseOrderItemId = response.body._id;
    })
})

/**
 * Test purchase order retrieval endpoint
 * @returns {Promise<void>}
 */
describe('GET /purchase-order/:id/item/:itemId', () => {
    it('should get purchase order item by id', async () => {
        const response = await request(app).get("/purchase-order/" + createdPurchaseOrderId + "/item/" + createdPurchaseOrderItemId).set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
    })
})

/**
 * Test purchase order update endpoint
 * @returns {Promise<void>}
 */
describe('PUT /purchase-order/:id/item/:itemId', () => {
    it('should update purchase order item', async () => {
        purchaseOrderData.notes = "Updated Test note.";
        const response = await request(app).put("/purchase-order/" + createdPurchaseOrderId + "/item/" + createdPurchaseOrderItemId).set('Authorization', `Bearer ${jwtToken}`).send(purchaseOrderItemData);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
    })
})

/**
 * Test purchase order deletion endpoint
 * @returns {Promise<void>}
 */
describe('DELETE /purchase-order/:id/item/:itemId', () => {
    it('should delete purchase order item', async () => {
        const response = await request(app).delete("/purchase-order/" + createdPurchaseOrderId + "/item/" + createdPurchaseOrderItemId).set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('msg');
        expect(response.body.msg).toBe('Item deleted');
    })
})


/**
 * Test purchase order deletion endpoint
 * @returns {Promise<void>}
 */
describe('DELETE /purchase-order/:id', () => {
    it('should delete purchase order', async () => {
        const response = await request(app).delete("/purchase-order/" + createdPurchaseOrderId).set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('msg');
        expect(response.body.msg).toBe('Purchase order deleted');
    })
})
