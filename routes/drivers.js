const express = require('express');

const driversController = require('../controllers/drivers');

const router = express.Router();

router.get('/drivers', driversController.getDrivers);
router.post('/drivers', driversController.postDrivers);

module.exports = router;
