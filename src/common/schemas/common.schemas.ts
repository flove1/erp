import { z } from 'zod';

export const idSchema = z.object({
  id: z.string().regex(/^\d+$/),
});

export const uuidSchema = z.object({
  id: z.uuid(),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().gte(1).default(1),
  list_size: z.coerce.number().gt(0).default(10),
});

export const paginationSchema = z.object({
  page: z.number(),
  list_size: z.number(),
  total: z.number(),
});

export const commonSchemas = { idSchema, uuidSchema, listQuerySchema, paginationSchema };
