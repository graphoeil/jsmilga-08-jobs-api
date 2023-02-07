// Imports
const { StatusCodes } = require("http-status-codes");

// Custom error handler
const errorHandlerMiddleware = (err, req, res, next) => {
	// Custom error object
	// Errors can be throw by ourself (see errors/custom-api.js ...)
	// or by MongoDB or by Mongoose validators in models
	let customError = {
		statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg:err.message || 'Something went wrong, try again later...'
	};
	// Validation error send by mongoose in the model
	if (err.name === 'ValidationError'){
		// Get all values for errors object
		customError.msg = Object.values(err.errors).map((item) => {
			return item.message;
		}).join(', ');
		customError.statusCode = 400;
	}
	// Duplicate email send by mongoDB
	// Because in models/User.js we have for email => unique:true
	if (err.code && err.code === 11000){
		/* {
			"err": {
				"driver": true,
				"name": "MongoError",
				"index": 0,
				"code": 11000, <= !!!!!! Code send by mongoDB !!!!!
				"keyPattern": {
					"email": 1
				},
				"keyValue": {
					"email": "graphoeil@gmail.com"
				}
			}
		} */
		customError.statusCode = 400;
		customError.msg = `Duplicate value entered for ${ Object.keys(err.keyValue) } field, please choose another value`;
	}
	// Cast error send by mongoDB (for the case in job where we send a uncorrect id)
	// in Postman => {{URL}}/jobs/63de704720d9d40cd18ccf27TTTTTTT ;-)
	if (err.name === 'CastError'){
		customError.msg = `No item found with id : ${ err.value }`;
		customError.statusCode = 404;
	}
	// Response
	return res.status(customError.statusCode).json({ msg:customError.msg });
};

// Export
module.exports = errorHandlerMiddleware;