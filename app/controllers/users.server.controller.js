'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Interest = mongoose.model('Interest');

var create = function (req, res) {
	var user = req.body;

	var interestIds = [];
	_.forEach(user.interests, function (interest) {
		Interest.findOne({'name': interest}, function (err, interestDoc) {
			if (!interestDoc) {
				var newInterestDoc = new Interest({name: interest});
				newInterestDoc.save();
			} else {
				var interestId = mongoose.Types.ObjectId(interestDoc._id);
				interestIds.push(interestId);
			}
		});
	});
	user.interests = interestIds;

	var userModel = new User(user);

	userModel.save(function (err) {
		if (!err) {
			res.jsonp('Works great!');
		}
	});
};

module.exports = {
	create: create
};