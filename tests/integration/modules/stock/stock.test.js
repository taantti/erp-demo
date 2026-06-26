import app from "../../../../src/app.js";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setup, teardown } from "../../../setup/db.js";
import request from 'supertest';
import { createMockTenant, createMockRole, createMockUser } from "../../../setup/mockData.js";
import { login } from "../../../setup/login.js";

let jwtToken = null;
let stockData = null;
let createdStockId = null;

/**
 * Create mock data for testing
 * @returns {Promise<void>}
 */
const createMockData = async () => {
    try {
        await createMockTenant();
        await createMockRole();
        await createMockUser();
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
 * Test stock creation endpoint
 * @returns {Promise<void>}
 */
describe('POST /stock', () => {
    it('should create new stock', async () => {
        stockData = {
            name: "Test Stock",
            active: true,
        }

        const response = await request(app).post("/stock").set('Authorization', `Bearer ${jwtToken}`).send(stockData);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        createdStockId = response.body._id;
    })
})

/**
 * Test stock retrieval endpoint
 * @returns {Promise<void>}
 */
describe('GET /stock/:id', () => {
    it('should get stock by id', async () => {
        const response = await request(app).get("/stock/" + createdStockId).set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
    })
})

/**
 * Test stock update endpoint
 * @returns {Promise<void>}
 */
describe('PUT /stock', () => {
    it('should update stock', async () => {
        stockData.name = "Updated Test";
        const response = await request(app).put("/stock/" + createdStockId).set('Authorization', `Bearer ${jwtToken}`).send(stockData);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
    })
})

/**
 * Test stock deletion endpoint
 * @returns {Promise<void>}
 */
describe('DELETE /stock/:id', () => {
    it('should delete stock', async () => {
        const response = await request(app).delete("/stock/" + createdStockId).set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('msg');
        expect(response.body.msg).toBe('Stock deleted');
    })
})