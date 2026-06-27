import app from "../../../../src/app.js";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setup, teardown } from "../../../setup/db.js";
import request from 'supertest';
import { createMockTenant, createMockRole, createMockUser, createMockStock } from "../../../setup/mockData.js";
import { login } from "../../../setup/login.js";

let jwtToken = null;
let shelfData = null;
let createdShelfId = null;
let mockStockId = null;

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
 * Test shelf creation endpoint
 * @returns {Promise<void>}
 */
describe('POST /stock/shelf', () => {
    it('should create new shelf', async () => {
        shelfData = {
            stockId: mockStockId,
            name: "Test Shelf",
            code: "TEST-SHELF",
            active: true
        }

        const response = await request(app).post("/stock/shelf").set('Authorization', `Bearer ${jwtToken}`).send(shelfData);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        createdShelfId = response.body._id;
    })
})

/**
 * Test shelf retrieval endpoint
 * @returns {Promise<void>}
 */
describe('GET /stock/shelf/:id', () => {
    it('should get shelf by id', async () => {
        const response = await request(app).get("/stock/shelf/" + createdShelfId).set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
    })
})

/**
 * Test shelf update endpoint
 * @returns {Promise<void>}
 */
describe('PUT /stock/shelf', () => {
    it('should update shelf', async () => {
        shelfData.name = "Updated Test";
        const response = await request(app).put("/stock/shelf/" + createdShelfId).set('Authorization', `Bearer ${jwtToken}`).send(shelfData);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
    })
})

/**
 * Test shelf deletion endpoint
 * @returns {Promise<void>}
 */
describe('DELETE /stock/shelf/:id', () => {
    it('should delete shelf', async () => {
        const response = await request(app).delete("/stock/shelf/" + createdShelfId).set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('msg');
        expect(response.body.msg).toBe('Shelf deleted');
    })
})