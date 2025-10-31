import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import config from "config";

import { authRegistry } from 'routes/auth';
import { fileRegistry } from 'routes/file';

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
      url: `http://${config.API.HOST}:${config.API.PORT}`,
      description: 'Local server',
    },
  ],
});
