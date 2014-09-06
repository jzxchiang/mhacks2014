'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	// crypto = require('crypto');

/**
 * Person Schema
 */
var PersonSchema = new Schema({
	name: {
		type: String,
		trim: true,
		default: ''
		// validate: [validateLocalStrategyProperty, 'Please fill in your full name']
	},
	email: {
		type: String,
		trim: true,
		default: '',
		// validate: [validateLocalStrategyProperty, 'Please fill in your email'],
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	password: {
		type: String,
		default: ''
		// validate: [validateLocalStrategyPassword, 'Password should be longer']
	},
	salt: {
		type: String
	},
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	},
	/* For reset password */
	resetPasswordToken: {
		type: String
	},
  	resetPasswordExpires: {
  		type: Date
  	}
});

mongoose.model('Person', PersonSchema);