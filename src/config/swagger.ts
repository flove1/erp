import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { authRegistry } from 'routes/auth/auth.schemas';
import { fileRegistry } from 'routes/file/file.routes';

const registry = new OpenAPIRegistry();
registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

const definitions = [
  ...registry.definitions,
  ...authRegistry.definitions,
  ...fileRegistry.definitions,
];

const generator = new OpenApiGeneratorV3(definitions);

export const swaggerSpec = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: 'ERP.AERO API',
    version: '1.0.0',
    description: 'Документация REST API для ERP.AERO',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server',
    },
  ],
});
