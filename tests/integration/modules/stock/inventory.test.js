import app from "../../../../src/app.js";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setup, teardown } from "../../../setup/db.js";
import request from 'supertest';
import { createMockTenant, createMockRole, createMockUser, createMockStock, createMockShelf, createMockProductCategory, createMockProduct } from "../../../setup/mockData.js";
import { login } from "../../../setup/login.js";

let jwtToken = null;
let inventoryData = null;
let createdInventoryId = null;
let mockStockId = null;
let mockShelfId = null;
let mockProductCategoryId = null;
let mockProductId = null;

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
        mockProductId = (await createMockProduct({ categoryIds: [mockProductCategoryId] }))._id;
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
 * Test inventory creation endpoint
 * @returns {Promise<void>}
 */
describe('POST /stock/inventory', () => {
    it('should create new inventory', async () => {
        inventoryData = {
            stockId: mockStockId,
            shelfId: mockShelfId,
            productId: mockProductId,
            quantity: 1
        }

        const response = await request(app).post("/stock/inventory").set('Authorization', `Bearer ${jwtToken}`).send(inventoryData);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        createdInventoryId = response.body._id;
    })
})

/**
 * Test inventory retrieval endpoint
 * @returns {Promise<void>}
 */
describe('GET /stock/inventory/:id', () => {
    it('should get inventory by id', async () => {
        const response = await request(app).get("/stock/inventory/" + createdInventoryId).set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
    })
})

/**
 * Test inventory update endpoint
 * @returns {Promise<void>}
 */
describe('PUT /stock/inventory/:id', () => {
    it('should update inventory', async () => {
        inventoryData.quantity++;
        const response = await request(app).put("/stock/inventory/" + createdInventoryId).set('Authorization', `Bearer ${jwtToken}`).send(inventoryData);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
    })
})

/**
 * Test inventory deletion endpoint
 * @returns {Promise<void>}
 */
describe('DELETE /stock/inventory/:id', () => {
    it('should delete inventory', async () => {
        const response = await request(app).delete("/stock/inventory/" + createdInventoryId).set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('msg');
        expect(response.body.msg).toBe('Inventory deleted');
    })
})



