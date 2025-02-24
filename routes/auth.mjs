import { Router } from 'express';
import { createUser, loginUser } from '../controllers/auth.mjs';

const router = Router();

router.post('/signup', createUser);
router.post('/login', loginUser);

export { router as authRoutes };
