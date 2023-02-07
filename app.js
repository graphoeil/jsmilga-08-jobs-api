// Express
const express = require('express');

// .env
require('dotenv').config();

// Async errors
require('express-async-errors');

// Connect to DB
const connectDB = require('./db/connect');

// App
const app = express();

// Middlewares
app.use(express.json());
// Security middlewares
const rateLimiter = require('express-rate-limit');
// Must enable proxy with (Heroku, Bluemix, AWS ELB, Nginx)
app.set('trust proxy', 1);
app.use(rateLimiter({
	// Time, here 15 minutes
	windowMs:15 * 60 * 1000,
	// Limit each IP to 100 requests per windowMS
	max:100
}));
const helmet = require('helmet');
app.use(helmet());
const cors = require('cors');
app.use(cors());
const xss = require('xss-clean');
app.use(xss());

// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./08-jobs-api.yaml');

// Routes
app.get('/', (req, res) => {
	res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});
// Swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
// Auth
const authRouter = require('./routes/auth');
app.use('/api/v1/auth', authRouter);
// Jobs
const jobsRouter = require('./routes/jobs');
const authenticateUser = require('./middleware/authentication');
app.use('/api/v1/jobs', authenticateUser, jobsRouter);
// 404
const notFoundMiddleware = require('./middleware/not-found');
app.use(notFoundMiddleware);
// Custom error
const errorHandlerMiddleware = require('./middleware/error-handler');
app.use(errorHandlerMiddleware);

// Port
const port = process.env.PORT || 3000;

// Start / Listen
const start = async() => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, console.log(`Server is listening on port ${ port }...`));
	} catch (error){
		console.log(error);
	}
};

// Init
start();