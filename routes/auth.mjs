import { Router } from 'express';
import { createUser, loginUser } from '../controllers/auth.mjs';
import { requestLimiter } from '../middleware/request-limiter.mjs';

const router = Router();

router.post('/signup', requestLimiter, createUser);
router.post('/login', requestLimiter, loginUser);

export { router as authRoutes };
