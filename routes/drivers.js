const express = require('express');

const driversController = require('../controllers/drivers');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/drivers/:userId', isAuth, driversController.getDrivers);
router.post('/drivers/:userId', isAuth, driversController.postDrivers);
router.get('/driver/:driverId', isAuth, driversController.getSingleDriver);
router.put('/driver/:driverId', isAuth, driversController.putDrivers);
router.delete('/driver/:driverId', isAuth, driversController.deleteDriver);

module.exports = router;
