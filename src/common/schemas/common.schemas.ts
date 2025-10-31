import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export const idSchema = z.object({
  id: z.string().regex(/^\d+$/),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().default(1),
  list_size: z.coerce.number().default(10),
});

export const paginationSchema = z.object({
  page: z.number(),
  list_size: z.number(),
  total: z.number(),
});

export const commonSchemas = { idSchema, listQuerySchema, paginationSchema };
