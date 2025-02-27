import { Router } from 'express';
import { getSingleDriver, putDriver, deleteDriver } from '../controllers/driver.mjs';
import { isAuth } from '../middleware/is-auth.mjs';
import { requestLimiter } from '../middleware/request-limiter.mjs';

const router = Router();

router.get('/driver/:driverId', requestLimiter, isAuth, getSingleDriver);
router.put('/driver/:driverId', requestLimiter, isAuth, putDriver);
router.delete('/driver/:driverId', requestLimiter, isAuth, deleteDriver);

export { router as driverRoutes };
