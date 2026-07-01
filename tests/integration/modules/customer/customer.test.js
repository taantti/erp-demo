import app from "../../../../src/app.js";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setup, teardown } from "../../../setup/db.js";
import request from 'supertest';
import { createMockTenant, createMockRole, createMockUser } from "../../../setup/mockData.js";
import { login } from "../../../setup/login.js";

let jwtToken = null;
let customerData = null;
let createdCustomerId = null;

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
 * Test customer creation endpoint
 * @returns {Promise<void>}
 */
describe('POST /customer', () => {
    it('should create new customer', async () => {
        customerData = {
            first_name: "Test Firstname",
            last_name: "Test Lastname",
            active: true
        }

        const response = await request(app).post("/customer").set('Authorization', `Bearer ${jwtToken}`).send(customerData);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        createdCustomerId = response.body._id;
    })
})

/**
 * Test customer retrieval endpoint
 * @returns {Promise<void>}
 */
describe('GET /customer/:id', () => {
    it('should get customer by id', async () => {
        const response = await request(app).get("/customer/" + createdCustomerId).set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
    })
})

/**
 * Test customer update endpoint
 * @returns {Promise<void>}
 */
describe('PUT /customer', () => {
    it('should update customer', async () => {
        customerData.first_name = "Updated Test";
        const response = await request(app).put("/customer/" + createdCustomerId).set('Authorization', `Bearer ${jwtToken}`).send(customerData);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
    })
})

/**
 * Test customer deletion endpoint
 * @returns {Promise<void>}
 */
describe('DELETE /customer/:id', () => {
    it('should delete customer', async () => {
        const response = await request(app).delete("/customer/" + createdCustomerId).set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('msg');
        expect(response.body.msg).toBe('Customer deleted');
    })
})