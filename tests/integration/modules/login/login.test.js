import app from "../../../../src/app.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from './../../../../src/config.js';
import { hashPassword } from "../../../../src/utils/password.js";
import { User } from './../../../../src/models/index.js';
import { Role } from './../../../../src/models/index.js';
import { log } from './../../../../src/utils/logger.js';
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setup, teardown } from "../../../setup/db.js";
import request from 'supertest';

/**
 * Create a mock role for testing
 * @returns {Promise<void>}
 */
const createMockRole = async () => {
    const mockRoleData = {
        name: "test-role",
        role: "OVERSEER",
        rolePermission: {}
    }

    try {
        const roleModel = new Role(mockRoleData);
        await roleModel.save();
    } catch (error) {
        throw error;
    }
}

/**
 * Create a mock user for testing
 * @returns {Promise<void>}
 */
const createMockUser = async () => {

    const hashedPassword = await hashPassword("test-password");

    const mockUserDate = {
        username: "test-user",
        password: hashedPassword,
        first_name: "Test",
        last_name: "User",
        email: "test@example.com",
        role: "OVERSEER",
        active: true,
        tenant: new mongoose.Types.ObjectId()
    }

    try {
        const userModel = new User(mockUserDate);
        await userModel.save();
    } catch (error) {
        throw error;
    }
}

/**
 * Create mock data for testing
 * @returns {Promise<void>}
 */
const createMockData = async () => {
    try {
        await createMockRole();
        await createMockUser();
    } catch (error) {
        log('Error creating mock data:', error, true);
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
        const response = await request(app).post("/login").send({username: "test-user", password: "test-password"});
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('login');
    })


    it('should not login with invalid username', async () => {
        const response = await request(app).post("/login").send({username: "invalid-user", password: "test-password"});
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
    })

    it('should not login with invalid password', async () => {
        const response = await request(app).post("/login").send({username: "test-user", password: "invalid-password"});
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
    })

    it('should not login with empty body', async () => {
        const response = await request(app).post("/login").send({});
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
    })
})
