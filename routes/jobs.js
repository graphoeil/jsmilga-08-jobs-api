// Imports
const express = require('express');
const { getAllJobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobs');

// Router
const jobsRouter = express.Router();

// Routes
jobsRouter.route('/').post(createJob).get(getAllJobs);
jobsRouter.route('/:id').get(getJob).patch(updateJob).delete(deleteJob);

// Export
module.exports = jobsRouter;