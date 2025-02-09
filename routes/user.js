const express = require('express');

const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/user', isAuth, userController.getUser);
router.put('/user', isAuth, userController.putUser);
router.delete('/user', isAuth, userController.deleteUser);

module.exports = router;
