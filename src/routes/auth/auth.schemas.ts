import { extendZodWithOpenApi, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export const authRegistry = new OpenAPIRegistry();

const signupRequestSchema = z.object({
  id: z.string().min(3),
  password: z.string().min(6),
});

const signinRequestSchema = z.object({
  id: z.string().min(3),
  password: z.string().min(6),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1).optional(),
});

const logoutRequestSchema = z.object({
  refreshToken: z.string().min(1),
});

const tokensResponseSchema = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string(),
  })
  .strip();

const infoResponseSchema = z
  .object({
    id: z.number(),
  })
  .strip();

export const authSchemas = {
  signupRequestSchema,
  signinRequestSchema,
  refreshTokenSchema,
  logoutRequestSchema,
  tokensResponseSchema,
  infoResponseSchema,
};
