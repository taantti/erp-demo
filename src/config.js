import dotenv from 'dotenv';
dotenv.config();

const config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PORT: process.env.DATABASE_PORT,
    DATABASE_NAME: process.env.DATABASE_NAME,
    DATABASE_USERNAME: process.env.DATABASE_USERNAME,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    PORT: process.env.PORT,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    JWT_PASSPHRASE: process.env.JWT_PASSPHRASE,  
    JWT_TOKEN_EXPIRATION: process.env.JWT_TOKEN_EXPIRATION,
    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
    INIT: (process.env.INIT.toLowerCase() === "true"),
INSTALL: (process.env.INSTALL.toLowerCase() === "true"),
ADD: (process.env.ADD.toLowerCase() === "true"),
LOG_LEVEL: process.env.LOG_LEVEL || 'info'
    
}

export default config;
