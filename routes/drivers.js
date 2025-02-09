const express = require('express');

const driversController = require('../controllers/drivers');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/drivers', isAuth, driversController.getDrivers);
router.post('/drivers', isAuth, driversController.postDrivers);

module.exports = router;
