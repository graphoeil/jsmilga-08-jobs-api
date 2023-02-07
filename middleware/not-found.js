// 404
const notFound = (req, res) => {
	return res.status(404).send('Route does not exist');
};

// Export
module.exports = notFound;