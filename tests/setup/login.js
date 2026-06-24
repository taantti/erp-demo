import { username, password } from "./mockData.js";
import request from 'supertest';
import app from "../../src/app.js";
import { log } from "../../src/utils/logger.js";

/**
 * Login with mock credentials
 * @returns {Promise<any>}
 */
export const login = async () => {
    try {
        const response = await request(app).post("/login").send({ username: username, password: password });
        return response;
    } catch (error) {
        log("ERROR", "Error logging in:", error, true);
        return null;
    }
}