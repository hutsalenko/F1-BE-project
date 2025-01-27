const express = require('express');

const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/user/:userId', isAuth, userController.getUser);
router.post('/user', isAuth, userController.postUser);
router.delete('/user/:userId', isAuth, userController.deleteUser);

module.exports = router;
