// Imports
const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');

// Bad request
class BadRequestError extends CustomAPIError{
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.BAD_REQUEST;
	};
};

// Export
module.exports = BadRequestError;