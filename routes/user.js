const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.get('/user', userController.getUser);
router.post('/user', userController.postUser);
router.delete('/user/:userId', userController.deleteUser);

module.exports = router;
