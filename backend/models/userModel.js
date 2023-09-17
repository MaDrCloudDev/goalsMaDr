const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'add name'],
		},
		email: {
			type: String,
			required: [true, 'add email'],
			unique: true,
		},
		password: {
			type: String,
			required: [true, 'add password'],
		},
	},
	{
		timestamps: true,
	},
);
module.exports = mongoose.model('User', userSchema);
