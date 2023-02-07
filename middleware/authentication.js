// Imports
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

// We want use this auth middleware for all our jobs routes !!!
// For that we use it in app.js (not in the controllers before controllers methods)
// Here => app.use('/api/v1/jobs', authMiddleware, jobsRouter);

// Check if user is authenticated
const auth = async(req, res, next) => {
	// This middleware is refactoring it avoids having all the code 
	// in controllers/auth.js at the level of the login function.
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer')){
		throw new UnauthenticatedError('Authentication invalid !');
	}
	// Because there is a space between Bearer and jwt token ;-)
	const token = authHeader.split(' ')[1];
	// Is token valid, token contain id and name (created in User instance methods)
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		// Attach user to the job routes
		req.user = { userId:payload.userId, name:payload.name };
	} catch (error){
		throw new UnauthenticatedError('Authentication invalid !');
	}
	// Next
	next();
};

// Export
module.exports = auth;