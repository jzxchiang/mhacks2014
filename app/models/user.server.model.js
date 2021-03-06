'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	exec = require('node-ssh-exec');
	// crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
// var validateLocalStrategyProperty = function(property) {
// 	return ((this.provider !== 'local' && !this.updated) || property.length);
// };

// *
//  * A Validation function for local strategy password
 
// var validateLocalStrategyPassword = function(password) {
// 	return (this.provider !== 'local' || (password && password.length > 6));
// };

function uniValidator (email, callback) {
	var uni = email.replace(/@.*/, '');

	var config = {
		host: 'cunix.columbia.edu',
		username: 'jc4127',
		password: 'wallerobot123$'
	};
	var command = 'lookup ' + uni + ' > /dev/null; echo $?';

	exec(config, command, function (err, response) {
		callback(response.trim() === '0');
	});
}

/**
 * User Schema
 */
var UserSchema = new Schema({
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
		match: [/.+\@.+\..+/, 'Please fill a valid email address'],
		validate: uniValidator
	},
	// password: {
	// 	type: String,
	// 	default: ''
	// 	// validate: [validateLocalStrategyPassword, 'Password should be longer']
	// },
	// salt: {
	// 	type: String
	// },
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	},
	interests: [{
		type: Schema.ObjectId,
		ref: 'Interest'
	}],
	matched: {
		type: Boolean,
		default: false
	}
	/* For reset password */
	// resetPasswordToken: {
		// type: String
	// },
  	// resetPasswordExpires: {
  		// type: Date
  	// }
});

/**
 * Hook a pre save method to hash the password
 */
// UserSchema.pre('save', function(next) {
// 	if (this.password && this.password.length > 6) {
// 		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
// 		this.password = this.hashPassword(this.password);
// 	}

// 	next();
// });

/**
 * Create instance method for hashing a password
 */
// UserSchema.methods.hashPassword = function(password) {
// 	if (this.salt && password) {
// 		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
// 	} else {
// 		return password;
// 	}
// };

// /**
//  * Create instance method for authenticating user
//  */
// UserSchema.methods.authenticate = function(password) {
// 	return this.password === this.hashPassword(password);
// };

/**
 * Find possible not used username
 */
// UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
// 	var _this = this;
// 	var possibleUsername = username + (suffix || '');

// 	_this.findOne({
// 		username: possibleUsername
// 	}, function(err, user) {
// 		if (!err) {
// 			if (!user) {
// 				callback(possibleUsername);
// 			} else {
// 				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
// 			}
// 		} else {
// 			callback(null);
// 		}
// 	});
// };

mongoose.model('User', UserSchema);