import { Router } from 'express';
import { authController } from './auth.controller';
import { authMiddleware } from 'middlewares/auth.middleware';
import { authSchemas } from './auth.schemas';
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi/dist/openapi-registry";

const router = Router();
const registry = new OpenAPIRegistry();

router.post('/signup', authController.signup);
registry.registerPath({
  method: 'post',
  path: '/signup',
  tags: ['Auth'],
  summary: 'Register a new user account',
  request: {
    body: {
      content: { 'application/json': { schema: authSchemas.signupRequestSchema } },
    },
  },
  responses: {
    200: {
      description: 'Signup successful',
      content: { 'application/json': { schema: authSchemas.tokensResponseSchema } },
    },
    400: { description: 'Invalid input' },
    409: { description: 'User already exists' },
  },
});

router.post('/signin', authController.signin);
registry.registerPath({
  method: 'post',
  path: '/signin',
  tags: ['Auth'],
  summary: 'Authenticate user and return tokens',
  request: {
    body: {
      content: { 'application/json': { schema: authSchemas.signinRequestSchema } },
    },
  },
  responses: {
    200: {
      description: 'Signin successful',
      content: { 'application/json': { schema: authSchemas.tokensResponseSchema } },
    },
    401: { description: 'Authentication failed' },
  },
});

router.use(authMiddleware);

router.post('/signin/new_token', authController.refreshToken);
registry.registerPath({
  method: 'post',
  path: '/signin/new_token',
  tags: ['Auth'],
  summary: 'Refresh authentication tokens using refresh token in cookie or body',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: { 'application/json': { schema: authSchemas.refreshTokenSchema } },
    },
  },
  responses: {
    200: {
      description: 'Token refreshed',
      content: { 'application/json': { schema: authSchemas.tokensResponseSchema } },
    },
    400: { description: 'Invalid refresh token' },
  },
});

router.get('/info', authController.info);

registry.registerPath({
  method: 'get',
  path: '/info',
  tags: ['Auth'],
  summary: 'Get authenticated user information',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'User info',
      content: { 'application/json': { schema: authSchemas.infoResponseSchema } },
    },
  },
});

router.post('/logout', authController.logout);
registry.registerPath({
  method: 'post',
  path: '/logout',
  tags: ['Auth'],
  summary: 'Logout the authenticated user through refresh token in cookie or body',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: { 'application/json': { schema: authSchemas.logoutRequestSchema } },
    },
  },
  responses: {
    200: { description: 'Logout successful' },
    400: { description: 'Invalid input' },
  },
});

export const authRoutes = router;
export const authRegistry = registry;
