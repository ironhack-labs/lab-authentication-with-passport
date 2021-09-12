// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const userSchema = new Schema(
// 	{
// 		username: String,
// 		password: String
// 	},
// 	{
// 		timestamps: true
// 	}
// );

// const User = mongoose.model('User', userSchema);
// module.exports = User;

// models/user.js

const { Schema, model } = require('mongoose');

const userSchema = new Schema(
	{
		username: String,
		passwordHash: String
	},
	{
		timestamps: true
	}
);

module.exports = model('User', userSchema);
