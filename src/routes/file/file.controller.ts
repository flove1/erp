import { Request, Response } from 'express';
import { fileService } from 'services/file.service';
import { commonSchemas } from 'common/schemas/common.schemas';
import { fileSchemas } from "./file.schemas";
import { HttpException } from "exceptions";
import z from 'zod';

async function uploadFile(req: Request, res: Response<z.infer<typeof fileSchemas.fileRecordSchema>>) {
  const file = req.file;
  if (!file) {
    throw new HttpException(400, 'No file uploaded');
  }

  file.originalname = Buffer
    .from(file.originalname, "latin1")
    .toString("utf8");

  const record = await fileService.uploadFile({ file, userId: req.user!.id });
  const sanitized = fileSchemas.fileRecordSchema.parse(record);

  res.json(sanitized);
}

async function listFiles(req: Request, res: Response<z.infer<typeof fileSchemas.listFilesResponseSchema>>) {
  const query = commonSchemas.listQuerySchema.parse(req.query);

  const { page, list_size } = query;
  const result = await fileService.listFiles({ page, list_size });

  const sanitized = fileSchemas.listFilesResponseSchema.parse({...result, list_size, page });

  res.json(sanitized);
}

async function getFileInfo(req: Request, res: Response<z.infer<typeof fileSchemas.fileRecordSchema>>) {
  const params = commonSchemas.idSchema.parse(req.params);
  const file = await fileService.getFileInfo(params.id);

  const sanitized = fileSchemas.fileRecordSchema.parse(file);

  res.json(sanitized);
}

async function downloadFile(req: Request, res: Response) {
  const params = commonSchemas.uuidSchema.parse(req.params);

  const { stream, record } = await fileService.downloadFile(params.id, req.user!.id);
  if (record.metadata) {
    if (record.metadata.filename) res.setHeader('X-File-Name', encodeURIComponent(record.metadata.filename));
    if (record.metadata.size) res.setHeader('X-File-Size', record.metadata.size);
    if (record.metadata.filename) res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(record.metadata.filename)}"`);
  } else {
  }

  res.setHeader('Content-Type', 'application/octet-stream');

  stream.pipe(res);
}

async function deleteFile(req: Request, res: Response) {
  const params = commonSchemas.uuidSchema.parse(req.params);
  await fileService.deleteFile(params.id, req.user!.id);

  res.sendStatus(200);
}

async function updateFile(req: Request, res: Response<z.infer<typeof fileSchemas.fileRecordSchema>>) {
  const params = commonSchemas.uuidSchema.parse(req.params);

  const file = req.file;
  if (!file) throw new HttpException(400, 'No file uploaded');

  file.originalname = Buffer
    .from(file.originalname, "latin1")
    .toString("utf8");

  const updated = await fileService.updateFile(params.id, file);
  const sanitized = fileSchemas.fileRecordSchema.parse(updated);

  res.json(sanitized);
}

export const fileController = { uploadFile, listFiles, getFileInfo, downloadFile, deleteFile, updateFile };
