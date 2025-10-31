import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: ['.env', `.env.${process.env.NODE_ENV || 'development'}`], quiet: true });

const dbConfigSchema = z.object({
  USER: z.string(),
  PASSWORD: z.string(),
  HOST: z.string(),
  PORT: z.coerce.number(),
  NAME: z.string(),
});

const apiConfigSchema = z.object({
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('localhost'),
});

const jwtConfigSchema = z.object({
  SECRET: z.string(),
  ACCESS_TOKEN_EXPIRY: z.string().default('10m'),
  REFRESH_TOKEN_EXPIRY: z.string().default('7d'),
});

const fileConfigSchema = z.object({
  UPLOAD_DIR: z.string().default('uploads').transform((dir) => path.join(process.cwd(), dir)),
  MAX_SIZE_MB: z.coerce.number().default(10),
});

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  API: apiConfigSchema,
  DB: dbConfigSchema,
  JWT: jwtConfigSchema,
  FILE: fileConfigSchema,
});

const prefixes = Object.entries(configSchema.shape)
  .filter(([k, value]) => typeof value === 'object')
  .map(([k]) => k);

function buildNestedEnv(env: NodeJS.ProcessEnv) {
  const nested: Record<string, any> = {};

  for (const [key, value] of Object.entries(env)) {
    if (!value) continue;

    const prefix = prefixes.find((p) => key.startsWith(`${p}_`));
    if (prefix) {
      const rest = key.slice(prefix.length + 1);
      if (rest) {
        (nested[prefix] ??= {})[rest] = value;
        continue;
      }
    }

    nested[key] = value;
  }

  return nested;
}

const rawNestedEnv = buildNestedEnv(process.env);

const config = configSchema.parse(rawNestedEnv);

export default config;
