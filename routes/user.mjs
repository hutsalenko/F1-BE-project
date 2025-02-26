import { Router } from 'express';
import { getUser, putUser, deleteUser } from '../controllers/user.mjs';
import { isAuth } from '../middleware/is-auth.mjs';

const router = Router();

router.get('/user', isAuth, getUser);
router.put('/user', isAuth, putUser);
router.delete('/user', isAuth, deleteUser);

export { router as userRoutes };
