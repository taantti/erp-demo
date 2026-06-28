import app from "../../../../src/app.js";
import { log } from './../../../../src/utils/logger.js';
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setup, teardown } from "../../../setup/db.js";
import request from 'supertest';
import { createMockTenant, createMockRole, createMockUser, username_1, password_1 } from "../../../setup/mockData.js";

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
        log("ERROR", "Error creating mock data:", error, true);
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
})

/**
 * Clean up test environment
 * @returns {Promise<void>}
 */
afterAll(async () => {
    await teardown();
})

/**
 * Test login endpoint
 * @returns {Promise<void>}
 */
describe('POST /login', () => {
    it('should login with valid username and password', async () => {
        const response = await request(app).post("/login").send({ username: username_1, password: password_1 });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('login');
    })

    it('should not login with invalid username', async () => {
        const response = await request(app).post("/login").send({ username: "invalid-user", password: password_1 });
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
    })

    it('should not login with invalid password', async () => {
        const response = await request(app).post("/login").send({ username: username_1, password: "invalid-password" });
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
    })

    it('should not login with empty body', async () => {
        const response = await request(app).post("/login").send({});
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
    })
})
