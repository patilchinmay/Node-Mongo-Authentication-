const express = require('express');
const router = express.Router();
const checkAuth = require('../../middlewares/check-auth');
const UserController = require('./user_controller');

// Add a new user

router.post('/register', UserController.user_register);

// Create token for a user and log him in

router.post('/login', UserController.user_login);

// Create a protected route. It requires user to be logged in to access.

router.post('/protected', checkAuth, UserController.user_protected);

// Forgot password. Ask to enter email.

router.post('/forgot_password', UserController.forgot_password);

// Reset password.

router.post('/reset_password', UserController.reset_password);

module.exports = router;