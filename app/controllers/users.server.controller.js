'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	async = require('async'),
	User = mongoose.model('User'),
	Interest = mongoose.model('Interest'),
	nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'nodemailer122895@gmail.com',
        pass: 'mhacks2014'
    }
});

function _sendEmail (user, matchedUser) {
	var mailOptions = {
	    from: 'MHacks ✔ <nodemailer122895@gmail.com>', // sender address
	    to: user.email, // list of receivers
	    subject: 'Your Match', // Subject line
	    text: 'Hi ' + user.name + ', \n\nYou have been matched with ' + matchedUser.name + '!\n Email: ' + matchedUser.email, // plaintext body
	    html: 'Hi ' + user.name + ', \n\nYou have been matched with ' + matchedUser.name + '!\n Email: ' + matchedUser.email
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function (error, info) {
	    if(error){
	        console.log(error);
	    } else {
	        console.log('Message sent: ' + info.response);
	    }
	});
}

function _matchUser (user) {
	var maxMatches = 0;
	var bestMatchSoFar;
	User.find({}, function (err, allUsers) {
		_.forEach(allUsers, function (otherUser) {
			var matchedInterests = user.interests.filter(function (interest) {
				return otherUser.interests.indexOf(interest) !== -1;
			});			

			if (matchedInterests.length > maxMatches) {
				if (user.name !== otherUser.name && user.email !== otherUser.email)	{
					maxMatches = matchedInterests.length;
					bestMatchSoFar = otherUser;
				}
			}
		});
		if (bestMatchSoFar) {
			_sendEmail(user, bestMatchSoFar);
			_sendEmail(bestMatchSoFar, user);
		}
	});


}


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
		user.interests = interestIds;

		var userModel = new User(user);
		userModel.save(function (err) {
			if (!err) {
				_matchUser(user);
			} else {
				console.log(err);
			}
		});
	});
};


module.exports = {
	create: create
};