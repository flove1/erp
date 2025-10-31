import { Router } from 'express';
import { authMiddleware } from 'middlewares/auth.middleware';
import { fileController } from "./file.controller";
import multer from 'multer';

const router = Router();

router.use(authMiddleware);
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), fileController.uploadFile);
router.put('/update/:id', upload.single('file'), fileController.updateFile);

router.get('/list', fileController.listFiles);
router.get('/:id', fileController.getFileInfo);
router.get('/download/:id', fileController.downloadFile);

router.delete('/delete/:id', fileController.deleteFile);

export default router;
