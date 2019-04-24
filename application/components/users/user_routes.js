const express = require('express');

const router = express.Router();

const checkAuth = require('../../middlewares/check-auth');

const User = require('./user_model');
const UserController = require('./user_controller');

// const checkVersion = require('../middleware/check_version');


// Add a new user

router.post('/register', UserController.user_register);

// Create token for a user and log him in

router.post('/login', UserController.user_login);

module.exports = router;