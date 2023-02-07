// Imports
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User schema
const UserSchema = new mongoose.Schema({
	name:{
		type:String,
		required:[true, 'Please provide name'],
		minlength:3,
		maxlength:50
	},
	email:{
		type:String,
		required:[true, 'Please provide email'],
		match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide valid email'],
		unique:true // to avoid having the same email twice in the database ;-)
	},
	password:{
		type:String,
		required:[true, 'Please provide password'],
		minlength:6
	}
});

// Pre
// Pre middleware functions are executed one after another, when each middleware calls next.
UserSchema.pre('save', async function(next){
	// Hash password, never never save password as string in DB !!!!
	// Salt is the level of security, 10 is very secured
	// Salt consumes CPU resources up to the level of security !
	const salt = await bcrypt.genSalt(10);
	// Here "this" point to the UserSchema
	this.password = await bcrypt.hash(this.password, salt);
	// Call next => res.status(StatusCodes.CREATED).json({ user }); in controllers/auth.js
	next();
});

// Instances methods
// Instances of Models are Documents.
// Documents have many of their own built-in instance methods.
// We may also define our own custom instance methods !
UserSchema.methods.getName = function(){
	return this.name;
};
UserSchema.methods.createJWT = function(){
	return jwt.sign({ userId:this._id, name:this.name }, process.env.JWT_SECRET, {
		expiresIn:process.env.JWT_LIFETIME
	});
};
UserSchema.methods.comparePassword = async function(candidatePassword){
	const isMatch = await bcrypt.compare(candidatePassword, this.password);
	return isMatch;
};

// Export
module.exports = mongoose.model('User', UserSchema);