import express from 'express';
import config from './config.js';
import { sanitizeAndValidateRequest }   from './middlewares/sanitizationMiddleware.js';
import authenticationMiddleware from './middlewares/authenticationMiddleware.js';
import validationErrorMiddleware from './middlewares/validationErrorMiddleware.js';
import errorHandler from './middlewares/errorMiddleware.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.js';
import routes from './routes/index.js';
import helmet from "helmet";
import cors from 'cors';

/* Initialize Express app */
const app = express();

/* Security middleware */
app.use(helmet()); 

/* CORS middleware. Allow all origins for development */
app.use(cors({
  origin: config.CORS_ORIGIN || 'http://localhost:5173',
}));

/* Body parser middleware */
app.use(express.json());

/* Sanitization middleware */
app.use(sanitizeAndValidateRequest);

/* Public routes */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/login', routes.login);

/* Authentication middleware */
app.use(authenticationMiddleware);

/* Protected routes */
app.use('/user', routes.user);
app.use('/tenant', routes.tenant);
app.use('/role', routes.role);
app.use('/product', routes.product);
app.use('/stock', routes.stock);
app.use('/asset', routes.asset);

/* Error handling middlewares */
app.use(validationErrorMiddleware);
app.use(errorHandler);

export default app;