import { Router } from 'express';
import { getSingleDriver, putDriver, deleteDriver } from '../controllers/driver.mjs';
import isAuth from '../middleware/is-auth.mjs';

const router = Router();

router.get('/driver/:driverId', isAuth, getSingleDriver);
router.put('/driver/:driverId', isAuth, putDriver);
router.delete('/driver/:driverId', isAuth, deleteDriver);

export { router as driverRoutes };
