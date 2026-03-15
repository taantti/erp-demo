import swaggerJsdoc from 'swagger-jsdoc';
import config from './config.js';

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
        url: `http://localhost:${config.PORT}`,
        description: `${config.NODE_ENV.charAt(0).toUpperCase() + config.NODE_ENV.slice(1)} server`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from /login',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', description: 'Error message' },
            logId: { type: 'string', description: 'Log entry ID for tracking' },
          },
        },
        ValidationError: {
          allOf: [
            { $ref: '#/components/schemas/Error' },
            {
              type: 'object',
              properties: {
                errors: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Validation error details',
                },
              },
            },
          ],
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'User ID' },
            username: { type: 'string', minLength: 3, maxLength: 30 },
            first_name: { type: 'string', minLength: 1, maxLength: 50 },
            last_name: { type: 'string', minLength: 1, maxLength: 50 },
            email: { type: 'string', format: 'email', minLength: 5, maxLength: 80 },
            role: { type: 'string', enum: ['OVERSEER', 'ADMIN', 'WRITER', 'READER'] },
            active: { type: 'boolean' },
            tenant: { type: 'string', description: 'Tenant ObjectId' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Tenant: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Tenant ID' },
            name: { type: 'string', minLength: 3, maxLength: 30 },
            admin: { type: 'boolean', description: 'Whether this is an admin tenant' },
            active: { type: 'boolean' },
          },
        },
        Permission: {
          type: 'object',
          properties: {
            access: { type: 'boolean' },
            adminTenantOnly: { type: 'boolean' },
            immutable: { type: 'boolean' },
          },
          required: ['access', 'adminTenantOnly', 'immutable'],
        },
        RolePermission: {
          type: 'object',
          description: 'Permission map per resource. Keys are action names (e.g. createUser, readUser).',
          properties: {
            product: { type: 'object', additionalProperties: { $ref: '#/components/schemas/Permission' } },
            role: { type: 'object', additionalProperties: { $ref: '#/components/schemas/Permission' } },
            tenant: { type: 'object', additionalProperties: { $ref: '#/components/schemas/Permission' } },
            user: { type: 'object', additionalProperties: { $ref: '#/components/schemas/Permission' } },
          },
        },
        Role: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Role ID' },
            name: { type: 'string', minLength: 3, maxLength: 30 },
            role: { type: 'string', enum: ['OVERSEER', 'ADMIN', 'WRITER', 'READER'] },
            rolePermission: { $ref: '#/components/schemas/RolePermission' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Product ID' },
            name: { type: 'string' },
            sku: { type: 'string' },
            unit: { type: 'string', enum: ['piece', 'kilogram', 'gram', 'liter', 'meter', 'centimeter', 'millimeter', 'box', 'no unit'] },
            description: { type: 'string' },
            categoryIds: { type: 'array', items: { type: 'string' }, description: 'Array of ProductCategory ObjectIds' },
            netPrice: { type: 'number' },
            grossPrice: { type: 'number' },
            vatRate: { type: 'number' },
            active: { type: 'boolean' },
            tenant: { type: 'string', description: 'Tenant ObjectId' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ProductCategory: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Category ID' },
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            parentId: { type: 'string', description: 'Parent category ObjectId' },
            level: { type: 'integer', description: 'Category depth level' },
            active: { type: 'boolean' },
            tenant: { type: 'string', description: 'Tenant ObjectId' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        DeleteResponse: {
          type: 'object',
          properties: {
            msg: { type: 'string', description: 'Success message' },
          },
        },
        UserCreate: {
          type: 'object',
          required: ['username', 'password', 'first_name', 'last_name', 'email', 'role', 'active'],
          properties: {
            username: { type: 'string', minLength: 3, maxLength: 30, description: 'Unique username (lowercase, trimmed)' },
            password: { type: 'string', minLength: 8, description: 'Must contain: uppercase, number, special character' },
            first_name: { type: 'string', minLength: 1, maxLength: 50 },
            last_name: { type: 'string', minLength: 1, maxLength: 50 },
            email: { type: 'string', format: 'email', minLength: 5, maxLength: 80 },
            role: { type: 'string', enum: ['OVERSEER', 'ADMIN', 'WRITER', 'READER'] },
            active: { type: 'boolean' },
          },
        },
        UserUpdate: {
          type: 'object',
          description: 'Fields username, password, and tenant cannot be changed through this endpoint.',
          properties: {
            first_name: { type: 'string', minLength: 1, maxLength: 50 },
            last_name: { type: 'string', minLength: 1, maxLength: 50 },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['OVERSEER', 'ADMIN', 'WRITER', 'READER'] },
            active: { type: 'boolean' },
          },
        },
        UpdatePassword: {
          type: 'object',
          required: ['username', 'password', 'new_password'],
          properties: {
            username: { type: 'string', description: 'Must match the authenticated user\'s username' },
            password: { type: 'string', description: 'Current password' },
            new_password: { type: 'string', description: 'New password' },
          },
        },
        TenantCreate: {
          type: 'object',
          required: ['name', 'admin'],
          properties: {
            name: { type: 'string', minLength: 3, maxLength: 30, description: 'Tenant name' },
            admin: { type: 'boolean', description: 'Whether this is an admin tenant' },
          },
        },
        TenantUpdate: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 3, maxLength: 30 },
            admin: { type: 'boolean' },
            active: { type: 'boolean' },
          },
        },
        RoleCreate: {
          type: 'object',
          required: ['name', 'role', 'rolePermission'],
          properties: {
            name: { type: 'string', minLength: 3, maxLength: 30, description: 'Display name for the role' },
            role: { type: 'string', enum: ['OVERSEER', 'ADMIN', 'WRITER', 'READER'], description: 'Role level' },
            rolePermission: { $ref: '#/components/schemas/RolePermission' },
          },
        },
        RoleUpdate: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 3, maxLength: 30 },
            role: { type: 'string', enum: ['OVERSEER', 'ADMIN', 'WRITER', 'READER'] },
            rolePermission: { $ref: '#/components/schemas/RolePermission' },
          },
        },
        ProductCreate: {
          type: 'object',
          required: ['name', 'sku', 'unit', 'active'],
          properties: {
            name: { type: 'string', description: 'Product name' },
            sku: { type: 'string', description: 'Unique stock keeping unit identifier' },
            unit: { type: 'string', enum: ['piece', 'kilogram', 'gram', 'liter', 'meter', 'centimeter', 'millimeter', 'box', 'no unit'] },
            description: { type: 'string' },
            categoryIds: { type: 'array', items: { type: 'string' }, description: 'Array of ProductCategory ObjectIds' },
            netPrice: { type: 'number' },
            grossPrice: { type: 'number' },
            vatRate: { type: 'number' },
            active: { type: 'boolean' },
          },
        },
        ProductUpdate: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            sku: { type: 'string' },
            unit: { type: 'string', enum: ['piece', 'kilogram', 'gram', 'liter', 'meter', 'centimeter', 'millimeter', 'box', 'no unit'] },
            description: { type: 'string' },
            categoryIds: { type: 'array', items: { type: 'string' } },
            netPrice: { type: 'number' },
            grossPrice: { type: 'number' },
            vatRate: { type: 'number' },
            active: { type: 'boolean' },
          },
        },
        CategoryCreate: {
          type: 'object',
          required: ['name', 'slug', 'active'],
          properties: {
            name: { type: 'string', description: 'Category name' },
            slug: { type: 'string', description: 'URL-friendly unique identifier' },
            description: { type: 'string' },
            parentId: { type: 'string', description: 'Parent category ObjectId (for subcategories)' },
            level: { type: 'integer', description: 'Category depth level (default 0)' },
            active: { type: 'boolean' },
          },
        },
        CategoryUpdate: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            parentId: { type: 'string' },
            level: { type: 'integer' },
            active: { type: 'boolean' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);

