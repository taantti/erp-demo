import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ERP Demo API',
      version: '1.0.0',
      description: 'API documentation for the ERP Demo application',
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);

