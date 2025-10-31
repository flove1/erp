import { z } from 'zod';

export const idSchema = z.object({ id: z.string().regex(/^\d+$/) });
export const listQuerySchema = z.object({
  page: z.coerce.number().default(1),
  list_size: z.coerce.number().default(10),
});
