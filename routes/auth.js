// Imports
const express = require('express');
const { register, login } = require('../controllers/auth');

// Router
const authRouter = express.Router();

// Routes
authRouter.post('/register', register);
authRouter.post('/login', login);

// Export
module.exports = authRouter;