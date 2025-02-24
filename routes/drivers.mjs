import { Router } from 'express';
import { getDrivers, postDrivers } from '../controllers/drivers.mjs';
import isAuth from '../middleware/is-auth.mjs';

const router = Router();

router.get('/drivers', isAuth, getDrivers);
router.post('/drivers', isAuth, postDrivers);

export { router as driversRoutes };
