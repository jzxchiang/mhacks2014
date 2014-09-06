'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Interest = mongoose.model('Interest');

/**
 * Globals
 */
var user;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function() {
	before(function(done) {
		user = new User({
			name: 'Justin Chiang',
			email: 'jc4127@columbia.edu',
			interests: [ mongoose.Types.ObjectId((new Interest({name: 'hockey'}))._id) ]
		});

		done();
	});

	describe('Method Save', function() {
		it('should begin with no users', function(done) {
			User.find({}, function(err, users) {
				users.should.have.length(0);
				done();
			});
		});

		it('should be able to save without problems', function(done) {
			user.save(done);
		});

	});

	after(function(done) {
		User.remove().exec();
		done();
	});
});