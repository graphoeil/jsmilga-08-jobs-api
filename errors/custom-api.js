// Custom api error Class (main)
class CustomAPIError extends Error {
	constructor(message) {
		super(message);
	};
};

// Exports
module.exports = CustomAPIError;