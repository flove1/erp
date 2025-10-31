import { z } from 'zod';

const SignupSchema = z.object({
  id: z.string().min(3),
  password: z.string().min(6),
});

const SigninSchema = z.object({
  id: z.string().min(3),
  password: z.string().min(6),
});

const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

const LogoutSchema = z.object({
  refreshToken: z.string().min(1),
});

export const authSchemas = { SignupSchema, SigninSchema, RefreshTokenSchema, LogoutSchema };
