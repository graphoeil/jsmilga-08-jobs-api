// Imports
const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

// Set Bearer and token dynamically in Postman
// To avoid copy and paste Bearer token... for each request
// 1° On the login request in postman go to tests tab (after body and Pre-request script)
/* 2° Add this :
const jsonData = pm.response.json();
pm.globals.set("accessToken", jsonData.token); */
// 3° Don't forget to send the request
// Then the token is save in a global variables
// 4° In the request that need the token, got to Authorization tab
// 5° Type => Select Bearer Token
// 6° In Token fields => {{accessToken}}

// Get all jobs
const getAllJobs = async(req, res) => {
	const jobs = await Job.find({ createdBy:req.user.userId }).sort('createdAt');
	res.status(StatusCodes.OK).json({ count:jobs.length, jobs });
};

// Get single job
const getJob = async(req, res) => {
	// Get jobId and userId
	const { user:{ userId }, params:{ id:jobId } } = req;
	// Job
	const job = await Job.findOne({ _id:jobId, createdBy:userId });
	// Job exist ?
	// This error is throwed if the jobId is correctly syntaxed
	// If not mongoDB return 500 error ;-)
	if (!job){
		throw new NotFoundError(`No job with id ${ jobId }`);
	}
	// Response
	res.status(StatusCodes.OK).json({ job });
};

// Create job
const createJob = async(req, res) => {
	// Add userId to req.body
	req.body.createdBy = req.user.userId;
	// Create job in mongoDB
	const job = await Job.create(req.body);
	// Response
	res.status(StatusCodes.CREATED).json({ job });
};

// Update job
const updateJob = async(req, res) => {
	// Get jobId and userId
	const { user:{ userId }, params:{ id:jobId }, 
		body:{ company, position } } = req;
	// Check company and position
	if (!company || !position){
		throw new BadRequestError('Company or position fields cannot be empty...');
	}
	// Update
	const job = await Job.findOneAndUpdate({ _id:jobId, createdBy:userId }, {
		company,
		position
		// new:true to get back the updated job
		// runValidators:true to check if updated job data match mongoose model
	}, { new:true, runValidators:true });
	// Job exist ?
	if (!job){
		throw new NotFoundError(`No job with id ${ jobId }`);
	}
	// Response, don't forget to send response !!!!
	res.status(StatusCodes.OK).json({ job });
};

// Delete job
const deleteJob = async(req, res) => {
	// Get job and userId
	const { user:{ userId }, params:{ id:jobId } } = req;
	// Delete
	const job = await Job.findOneAndDelete({ _id:jobId, createdBy:userId });
	// Job exist ?
	if (!job){
		throw new NotFoundError(`No job with id ${ jobId }`);
	}
	// Response
	res.status(StatusCodes.OK).send();
};

// Exports
module.exports = {
	getAllJobs,
	getJob,
	createJob,
	updateJob,
	deleteJob
};