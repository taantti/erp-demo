import app from "../../../../src/app.js";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setup, teardown } from "../../../setup/db.js";
import request from 'supertest';
import {
    createMockTenant, createMockRole, createMockUser,
    createMockStock, createMockShelf, createMockProductCategory, createMockProduct, initProductData,
    createMockCustomer
} from "../../../setup/mockData.js";

import { login } from "../../../setup/login.js";
import { SaleOrderStatuses } from '../../../../src/models/saleOrderModel.js';

let jwtToken = null;
let saleOrderData = null;
let createdSaleOrderId = null;
let saleOrderItemData = null;
let createdSaleOrderItemId = null;
let mockStockId = null;
let mockShelfId = null;
let mockProductCategoryId = null;
let mockProductId1 = null;
let mockProductId2 = null;
let mockCustomerId = null;

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
        mockCustomerId = (await createMockCustomer())._id;
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
 * Test sale order creation endpoint
 * @returns {Promise<void>}
 */
describe('POST /sale-order', () => {
    it('should create new sale order', async () => {
        saleOrderData = {
            orderNumber: 1000,
            customerId: mockCustomerId,
            status: SaleOrderStatuses.DRAFT,
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

        const response = await request(app).post("/sale-order").set('Authorization', `Bearer ${jwtToken}`).send(saleOrderData);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        createdSaleOrderId = response.body._id;
    })
})

/**
 * Test sale order retrieval endpoint
 * @returns {Promise<void>}
 */
describe('GET /sale-order/:id', () => {
    it('should get sale order by id', async () => {
        const response = await request(app).get("/sale-order/" + createdSaleOrderId).set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
    })
})

/**
 * Test sale order update endpoint
 * @returns {Promise<void>}
 */
describe('PUT /sale-order/:id', () => {
    it('should update sale order', async () => {
        saleOrderData.notes = "Updated Test note.";
        const response = await request(app).put("/sale-order/" + createdSaleOrderId).set('Authorization', `Bearer ${jwtToken}`).send(saleOrderData);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
    })
})

/**
 * Test sale order item creation endpoint
 * @returns {Promise<void>}
 */
describe('POST /sale-order/:id/item', () => {
    it('should create new sale order item', async () => {
        saleOrderItemData = {
            productName: "Test product name 2",
            productId: mockProductId2,
            stockId: mockStockId,
            shelfId: mockShelfId,
            quantity: 101,
            unitNetPrice: 200,
            unitGrossPrice: 251,
            vat: 25.5,
            sendQuantity: 0
        };

        const response = await request(app).post("/sale-order/" + createdSaleOrderId + "/item").set('Authorization', `Bearer ${jwtToken}`).send(saleOrderItemData);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        createdSaleOrderItemId = response.body._id;
    })
})

/**
 * Test sale order retrieval endpoint
 * @returns {Promise<void>}
 */
describe('GET /sale-order/:id/item/:itemId', () => {
    it('should get sale order item by id', async () => {
        const response = await request(app).get("/sale-order/" + createdSaleOrderId + "/item/" + createdSaleOrderItemId).set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
    })
})

/**
 * Test sale order update endpoint
 * @returns {Promise<void>}
 */
describe('PUT /sale-order/:id/item/:itemId', () => {
    it('should update sale order item', async () => {
        saleOrderData.notes = "Updated Test note.";
        const response = await request(app).put("/sale-order/" + createdSaleOrderId + "/item/" + createdSaleOrderItemId).set('Authorization', `Bearer ${jwtToken}`).send(saleOrderItemData);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
    })
})

/**
 * Test sale order deletion endpoint
 * @returns {Promise<void>}
 */
describe('DELETE /sale-order/:id/item/:itemId', () => {
    it('should delete sale order item', async () => {
        const response = await request(app).delete("/sale-order/" + createdSaleOrderId + "/item/" + createdSaleOrderItemId).set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('msg');
        expect(response.body.msg).toBe('Item deleted');
    })
})


/**
 * Test sale order deletion endpoint
 * @returns {Promise<void>}
 */
describe('DELETE /sale-order/:id', () => {
    it('should delete sale order', async () => {
        const response = await request(app).delete("/sale-order/" + createdSaleOrderId).set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('msg');
        expect(response.body.msg).toBe('Sale order deleted');
    })
})
