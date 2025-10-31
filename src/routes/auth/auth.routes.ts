import { Router } from 'express';
import { authController } from './auth.controller';
import { authMiddleware } from 'middlewares/auth.middleware';

const router = Router();

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

router.use(authMiddleware);

router.post('/signin/new_token', authController.refreshToken);
router.get('/info', authController.info);
router.post('/logout', authController.logout);

export default router;
