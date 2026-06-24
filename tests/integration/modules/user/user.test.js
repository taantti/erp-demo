import app from "../../../../src/app.js";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setup, teardown } from "../../../setup/db.js";
import request from 'supertest';
import { createMockTenant, createMockRole, createMockUser, username, password } from "../../../setup/mockData.js";
import { login } from "../../../setup/login.js";

let jwtToken = null;
let userData = null;
let createdUserId = null;

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
 * Test user creation endpoint
 * @returns {Promise<void>}
 */
describe('POST /user', () => {
    userData = {
        first_name: "Test",
        last_name: "User",
        email: "test.user@example.com",
        role: "OVERSEER",
        active: true,
        username: "testuser",
        password: "Test-Password123!"
    }


    it('should create new user', async () => {
        const response = await request(app).post("/user").set('Authorization', `Bearer ${jwtToken}`).send(userData);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        createdUserId = response.body._id;

    })
})

/**
 * Test user retrieval endpoint
 * @returns {Promise<void>}
 */
describe('GET /user/:id', () => {
    it('should get user by id', async () => {
        const response = await request(app).get("/user/" + createdUserId).set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
    })
})

/**
 * Test user update endpoint
 * @returns {Promise<void>}
 */
describe('PUT /user', () => {
    it('should update user', async () => {
        userData.first_name = "Updated Test";
        userData.last_name = "Updated User";
        const response = await request(app).put("/user/" + createdUserId).set('Authorization', `Bearer ${jwtToken}`).send(userData);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
    })
})

/**
 * Test user deletion endpoint
 * @returns {Promise<void>}
 */
describe('DELETE /user', () => {
    it('should delete user', async () => {
        const response = await request(app).delete("/user/" + createdUserId).set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('msg');
        expect(response.body.msg).toBe('User deleted');
    })
})