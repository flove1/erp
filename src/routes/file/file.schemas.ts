import { commonSchemas } from 'common/schemas/common.schemas';
import z from 'zod';

const fileRecordSchema = z
  .object({
    id: z.string(),
    uploadedAt: z.date(),
    metadata: z.object({
      filename: z.string().optional(),
      extension: z.string().optional(),
      size: z.number().optional(),
      mimetype: z.string().optional(),
    }),
  })
  .strip();

const listFilesResponseSchema = z
  .object({
    files: z.array(fileRecordSchema),
  })
  .extend(commonSchemas.paginationSchema.shape);

export const fileSchemas = { fileRecordSchema, listFilesResponseSchema };
