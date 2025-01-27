const express = require('express');

const driversController = require('../controllers/drivers');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/drivers/:userId', isAuth, driversController.getDrivers);
router.post('/drivers/:userId', isAuth, driversController.postDrivers);
router.delete('/drivers/:driverId', isAuth, driversController.deleteDrivers);

module.exports = router;
