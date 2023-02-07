// Imports
const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');

// Not found (404)
class NotFoundError extends CustomAPIError {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.NOT_FOUND;
	};
};

// Export
module.exports = NotFoundError;