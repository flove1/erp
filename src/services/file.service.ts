import { AppDataSource } from 'db/datasource';
import { FileEntity } from '../db/entities/file.entity';
import { UserEntity } from '../db/entities/user.entity';
import fs from 'fs';
import path from 'path';
import config from 'config';

const userRepo = AppDataSource.getRepository(UserEntity);
const fileRepo = AppDataSource.getRepository(FileEntity);

function ensureUploadDir() {
  if (!fs.existsSync(config.FILE.UPLOAD_DIR)) {
    fs.mkdirSync(config.FILE.UPLOAD_DIR, { recursive: true });
  }
}

async function uploadFile({ file, userId }: { file: Express.Multer.File; userId: number }) {
  ensureUploadDir();

  const user = await userRepo.findOneBy({ id: userId });
  if (!user) throw new Error('User not found');

  const entity = fileRepo.create({
    metadata: {
      filename: file.originalname,
      extension: path.extname(file.originalname).slice(1),
      mimetype: file.mimetype,
      size: file.size,
    },
    user,
  });

  await fileRepo.save(entity);

  const storagePath = path.join(config.FILE.UPLOAD_DIR, String(entity.id));
  fs.writeFileSync(storagePath, file.buffer);

  return entity;
}

async function listFiles({ page = 1, list_size = 10 }) {
  const [files, total] = await fileRepo.findAndCount({
    skip: (page - 1) * list_size,
    take: list_size,
    relations: ['user'],
    order: { uploadedAt: 'DESC' },
  });
  return { files, total };
}

async function getFileInfo(fileId: string, userId?: number) {
  console.log("Getting file info for fileId:", fileId, "userId:", userId);

  const entity = await fileRepo.findOne({
    where: {
      id: fileId,
      user: userId ? { id: userId } : undefined
    },
  });

  if (!entity) throw new Error('File not found');

  return entity;
}

async function downloadFile(
  fileId: string,
  userId?: number
): Promise<{ stream: fs.ReadStream; record: FileEntity }> {
  const entity = await fileRepo.findOne({
    where: {
      id: fileId,
      user: userId ? { id: userId } : undefined
    },
    relations: ['user'],
  });

  if (!entity) throw new Error('File not found');

  const filePath = path.join(config.FILE.UPLOAD_DIR, String(entity.id));
  if (!fs.existsSync(filePath)) throw new Error('File not found on disk');

  return { stream: fs.createReadStream(filePath), record: entity };
}

async function deleteFile(fileId: string, userId: number) {
  const entity = await fileRepo.findOneBy({
    id: fileId,
    user: { id: userId }
  });
  if (!entity) throw new Error('File not found');

  const storagePath = path.join(config.FILE.UPLOAD_DIR, String(entity.id));
  if (fs.existsSync(storagePath)) fs.unlinkSync(storagePath);

  await fileRepo.remove(entity);
}

async function updateFile(fileId: string, file: Express.Multer.File) {
  ensureUploadDir();
  const entity = await fileRepo.findOneBy({ id: fileId });
  if (!entity) throw new Error('File not found');

  const storagePath = path.join(config.FILE.UPLOAD_DIR, String(fileId));
  if (fs.existsSync(storagePath)) fs.unlinkSync(storagePath);

  entity.metadata.filename = file.originalname;
  entity.metadata.extension = path.extname(file.originalname).slice(1);
  entity.metadata.mimetype = file.mimetype;
  entity.metadata.size = file.size;
  entity.uploadedAt = new Date();

  await fileRepo.save(entity);

  fs.writeFileSync(storagePath, file.buffer);

  return { ...entity, filePath: storagePath };
}

export const fileService = { uploadFile, listFiles, getFileInfo, downloadFile, deleteFile, updateFile };
