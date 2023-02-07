// Imports
const CustomAPIError = require('./custom-api');
const UnauthenticatedError = require('./unauthenticated');
const NotFoundError = require('./not-found');
const BadRequestError = require('./bad-request');

// Exports
module.exports = {
	CustomAPIError,
	UnauthenticatedError,
	NotFoundError,
	BadRequestError
};