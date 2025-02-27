import { Router } from 'express';
import { getDrivers, postDrivers } from '../controllers/drivers.mjs';
import { isAuth } from '../middleware/is-auth.mjs';
import { requestLimiter } from '../middleware/request-limiter.mjs';

const router = Router();

router.get('/drivers', requestLimiter, isAuth, getDrivers);
router.post('/drivers', requestLimiter, isAuth, postDrivers);

export { router as driversRoutes };
