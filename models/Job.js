// Imports
const mongoose = require('mongoose');

// Job schema
const JobSchema = new mongoose.Schema({
	company:{
		type:String,
		required:[true, 'Please provide company name'],
		maxlength:50
	},
	position:{
		type:String,
		required:[true, 'Please provide position'],
		maxlength:100
	},
	status:{
		type:String,
		enum:['interview','declined','pending'],
		default:'pending'
	},
	createdBy:{
		type:mongoose.Types.ObjectId,
		ref:'User',
		required:[true, 'Please provide user']
	}
	// timestamps:true to have createdAt and updateAt
	// in the response json
	/* "job": {
        "status": "pending",
        "_id": "63de6d498bf7eb0c45458112",
        "company": "Cisco",
        "position": "Front-end developer",
        "createdBy": "63de526c27d8fe0a6d6410d1",
        "createdAt": "2023-02-04T14:35:53.287Z",
        "updatedAt": "2023-02-04T14:35:53.287Z",
        "__v": 0
    } */
}, { timestamps:true });

// Export
module.exports = mongoose.model('Job', JobSchema);