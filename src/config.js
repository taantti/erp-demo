import dotenv from 'dotenv';
dotenv.config();

/* Configuration settings loaded from environment variables. */
const config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
    DATABASE_PORT: process.env.DATABASE_PORT || '',
    DATABASE_NAME: process.env.DATABASE_NAME || '',
    DATABASE_USERNAME: process.env.DATABASE_USERNAME || '',
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || '',
    PORT: process.env.PORT || '',
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || '',
    JWT_PASSPHRASE: process.env.JWT_PASSPHRASE || '',
    JWT_TOKEN_EXPIRATION: process.env.JWT_TOKEN_EXPIRATION || '',
    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS || 10,
    INIT: (process.env.INIT?.toLowerCase() === "true"),
    INSTALL: (process.env.INSTALL?.toLowerCase() === "true"),
    ADD: (process.env.ADD?.toLowerCase() === "true"),
    LOG_LEVEL: process.env.LOG_LEVEL || 'INFO',
    LOG_TO_FILE: (process.env.LOG_TO_FILE?.toLowerCase() === "true"),
    MAX_REQUEST_BODY_SIZE: parseInt(process.env.MAX_REQUEST_BODY_SIZE) || 100000,
    MAX_QUERY_PARAM_LENGTH: parseInt(process.env.MAX_QUERY_PARAM_LENGTH) || 255,
    MAX_PATH_PARAM_LENGTH: parseInt(process.env.MAX_PATH_PARAM_LENGTH) || 100,
    MAX_QUERY_STRING_LENGTH: parseInt(process.env.MAX_QUERY_STRING_LENGTH) || 2048,
    MAX_DEPTH: parseInt(process.env.MAX_DEPTH) || 10,
    MAX_OBJECT_LENGTH: parseInt(process.env.MAX_OBJECT_LENGTH) || 100,
    MAX_ARRAY_LENGTH: parseInt(process.env.MAX_ARRAY_LENGTH) || 100,
    MAX_VALUE_LENGTH: parseInt(process.env.MAX_VALUE_LENGTH) || 1000
}

export default config;
