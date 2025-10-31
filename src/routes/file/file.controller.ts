import { Request, Response } from 'express';
import { fileService } from 'services/file.service';
import { idSchema, listQuerySchema } from '../../common/schemas/common.schemas';
import { fileSchemas } from "./file.schemas";
import { HttpException } from "exceptions";
import z from 'zod';

async function uploadFile(req: Request, res: Response<z.infer<typeof fileSchemas.fileRecordSchema>>) {
  const file = req.file;
  if (!file) {
    throw new HttpException(400, 'No file uploaded');
  }

  const record = await fileService.uploadFile({ file, userId: req.user.id });
  const sanitized = fileSchemas.fileRecordSchema.parse(record);

  res.json(sanitized);
}

async function listFiles(req: Request, res: Response<z.infer<typeof fileSchemas.listFilesResponseSchema>>) {
  const query = listQuerySchema.parse(req.query);

  const { page, list_size } = query;
  const result = await fileService.listFiles({ page, list_size });

  const sanitized = fileSchemas.listFilesResponseSchema.parse(result.files);

  res.json(sanitized);
}

async function getFileInfo(req: Request, res: Response<z.infer<typeof fileSchemas.fileRecordSchema>>) {
  const params = idSchema.parse(req.params);
  const file = await fileService.getFileInfo(params.id);

  const sanitized = fileSchemas.fileRecordSchema.parse(file);

  res.json(sanitized);
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
}

async function updateFile(req: Request, res: Response<z.infer<typeof fileSchemas.fileRecordSchema>>) {
  const params = idSchema.parse(req.params);

  const file = req.file;
  if (!file) throw new HttpException(400, 'No file uploaded');

  const updated = await fileService.updateFile(params.id, file);
  const sanitized = fileSchemas.fileRecordSchema.parse(updated);

  res.json(sanitized);
}

export const fileController = { uploadFile, listFiles, getFileInfo, downloadFile, deleteFile, updateFile };
