'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	async = require('async'),
	User = mongoose.model('User'),
	Interest = mongoose.model('Interest');

var create = function (req, res) {
	var user = req.body;
	var interestIds = [];
	var newInterestModels = [];

	async.each(user.interests, function (interest, done) {
		Interest.findOne({'name': interest}, function (err, interestDoc) {
			if (interestDoc) {
				interestIds.push(mongoose.Types.ObjectId(interestDoc._id));
				done();
			} else {
				var newInterest = new Interest({name: interest});
				newInterest.save(function (err, newInterestDoc) {
					interestIds.push(mongoose.Types.ObjectId(newInterestDoc._id));
					done();
				});
			}
		});
	}, function (err) {
		console.log(interestIds);
		user.interests = interestIds;

		console.log(user);
		var userModel = new User(user);

		userModel.save(function (err) {
			if (!err) {
				res.jsonp('Works great!');
			}
		});
	});
};

module.exports = {
	create: create
};