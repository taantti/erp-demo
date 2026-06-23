import mongoose from "mongoose";
import config from "../../src/config.js";
import { log } from "../../src/utils/logger.js";

/**
 * Connect to the test database
 * @returns {Promise<void>}
 */
const connect = async () => {
    try {
        await mongoose.connect(config.DATABASE_URI_TEST);
        log("INFO", "Connected to test database: " + config.DATABASE_URI_TEST, true);
    } catch (error) {
        log("ERROR", `Connection to ${config.DATABASE_URI_TEST} database failed`, true);
        log("ERROR", `${error.name}: ${error.message}`, true);
        process.exit(1);
    }
}

/**
 * Disconnect from the test database
 * @returns {Promise<void>}
 */
const disconnect = async () => {
    await mongoose.disconnect();
    log("INFO", "Disconnected from test database", true);
}

/**
 * Drop the test database
 * @returns {Promise<void>}
 */
const dropDatabase = async () => {
    await mongoose.connection.dropDatabase();
}

/**
 * Setup the test database
 * @returns {Promise<void>}
 */
export const setup = async () => {
    await connect();
}

/**
 * Teardown the test database
 * @returns {Promise<void>}
 */
export const teardown = async () => {
    await dropDatabase();
    await disconnect();
}
