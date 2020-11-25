const router = require('express').Router();
const UserController = require('../controllers/authController');

router.post('/signup', UserController.createUser);

router.post('/login', UserController.userLogin);

module.exports = router;