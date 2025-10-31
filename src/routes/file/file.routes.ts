import { Router } from 'express';
import { authMiddleware } from 'middlewares/auth.middleware';
import { fileController } from "./file.controller";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { commonSchemas } from "common/schemas/common.schemas";
import { fileSchemas } from "./file.schemas";
import multer from 'multer';

const router = Router();
const registry = new OpenAPIRegistry();

router.use(authMiddleware);
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), fileController.uploadFile);
registry.registerPath({
  method: 'post',
  path: '/file/upload',
  tags: ['File'],
  summary: 'Upload a new file',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } },
        },
      },
    },
  },
  responses: {
    200: { description: 'File uploaded successfully', content: { 'application/json': { schema: fileSchemas.fileRecordSchema } } },
    400: { description: 'No file uploaded' },
  },
});

router.put('/update/:id', upload.single('file'), fileController.updateFile);
registry.registerPath({
  method: 'put',
  path: '/file/update/{id}',
  tags: ['File'],
  summary: 'Update an existing file',
  security: [{ bearerAuth: [] }],
  request: {
    params: commonSchemas.uuidSchema,
    body: {
      content: {
        'multipart/form-data': {
          schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } },
        },
      },
    },
  },
  responses: {
    200: { description: 'File updated successfully', content: { 'application/json': { schema: fileSchemas.fileRecordSchema } } },
    400: { description: 'No file uploaded' },
  },
});

router.get('/list', fileController.listFiles);
registry.registerPath({
  method: 'get',
  path: '/file/list',
  tags: ['File'],
  summary: 'List files',
  security: [{ bearerAuth: [] }],
  request: { query: commonSchemas.listQuerySchema },
  responses: {
    200: { description: 'List of files', content: { 'application/json': { schema: fileSchemas.listFilesResponseSchema } } },
  },
});

router.get('/:id', fileController.getFileInfo);
registry.registerPath({
  method: 'get',
  path: '/file/{id}',
  tags: ['File'],
  summary: 'Get file info',
  security: [{ bearerAuth: [] }],
  request: { params: commonSchemas.uuidSchema },
  responses: {
    200: { description: 'File info', content: { 'application/json': { schema: fileSchemas.fileRecordSchema } } },
  },
});

router.get('/download/:id', fileController.downloadFile);
registry.registerPath({
  method: 'get',
  path: '/file/download/{id}',
  tags: ['File'],
  summary: 'Download a file',
  security: [{ bearerAuth: [] }],
  request: { params: commonSchemas.uuidSchema },
  responses: {
    200: {
      description: 'File stream',
      content: {
        'application/octet-stream': {
          schema: { type: 'string', format: 'binary' }
        }
      }
    }
  }
});

router.delete('/delete/:id', fileController.deleteFile);
registry.registerPath({
  method: 'delete',
  path: '/file/delete/{id}',
  tags: ['File'],
  summary: 'Delete a file',
  security: [{ bearerAuth: [] }],
  request: { params: commonSchemas.uuidSchema },
  responses: {
    200: { description: 'File deleted' },
  },
});

export const fileRoutes = router;
export const fileRegistry = registry;
