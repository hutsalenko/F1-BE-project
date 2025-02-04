const express = require('express');

const driverController = require('../controllers/driver');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/driver/:driverId', isAuth, driverController.getSingleDriver);
router.put('/driver/:driverId', isAuth, driverController.putDriver);
router.delete('/driver/:driverId', isAuth, driverController.deleteDriver);

module.exports = router;
