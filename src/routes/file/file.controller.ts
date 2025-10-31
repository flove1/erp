import { Request, Response } from 'express';
import { fileService } from 'services/file.service';
import { idSchema, listQuerySchema } from './file.schemas';
import { treeifyError } from 'zod';

async function uploadFile(req: Request, res: Response) {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const record = await fileService.uploadFile({ file, userId: req.user.id });

  res.json(record);
}

async function listFiles(req: Request, res: Response) {
  const query = listQuerySchema.safeParse(req.query);
  if (!query.success) {
    return res.status(400).json({ error: treeifyError(query.error) });
  }

  const { page, list_size } = query.data;
  const result = await fileService.listFiles({ page, list_size });

  res.json(result);
}

async function getFileInfo(req: Request, res: Response) {
  const params = idSchema.parse(req.params);
  const file = await fileService.getFileInfo(params.id);

  res.json(file);
}

async function downloadFile(req: Request, res: Response) {
  const params = idSchema.parse(req.params);

  const { stream, record } = await fileService.downloadFile(params.id, req.user.id);
  if (record.metadata) {
    if (record.metadata.filename) res.setHeader('X-File-Name', record.metadata.filename);
    if (record.metadata.size) res.setHeader('X-File-Size', record.metadata.size);
    if (record.metadata.mimetype) res.setHeader('Content-Type', record.metadata.mimetype);
  }

  stream.pipe(res);
}

async function deleteFile(req: Request, res: Response) {
  const params = idSchema.parse(req.params);
  await fileService.deleteFile(params.id, req.user.id);
  res.json({ success: true });
}

async function updateFile(req: Request, res: Response) {
  const params = idSchema.parse(req.params);

  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  const updated = await fileService.updateFile(params.id, file);

  res.json(updated);
}

export const fileController = {
  uploadFile,
  listFiles,
  getFileInfo,
  downloadFile,
  deleteFile,
  updateFile,
};
