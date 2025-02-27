import { Router } from 'express';
import { getUser, putUser, deleteUser } from '../controllers/user.mjs';
import { isAuth } from '../middleware/is-auth.mjs';
import { requestLimiter } from '../middleware/request-limiter.mjs';

const router = Router();

router.get('/user', requestLimiter, isAuth, getUser);
router.put('/user', requestLimiter, isAuth, putUser);
router.delete('/user', requestLimiter, isAuth, deleteUser);

export { router as userRoutes };
