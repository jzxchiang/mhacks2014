'use strict';

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


function _sendEmail (user, matchedUser, commonInterest) {
	var mailOptions = {
	    from: 'MHacks ✔ <nodemailer122895@gmail.com>',
	    to: user.email,
	    subject: 'Your Match',
	    text: 'Hi ' + user.name + ', \n\nYou have been matched with ' + matchedUser.name + '! (email: ' + matchedUser.email +
	    	  ')\nBoth of you indicated an interest in ' + commonInterest.name + '!'
	};

	transporter.sendMail(mailOptions, function (err, info) {
	    if (err) {
	        console.log(err);
	    } else {
	        console.log('Message sent: ' + info.response);
	        User.update({'_id': user._id}, {matched: true}, {multi: false}, function (err) {
	        	if (err) {
	        		console.log(err);
	        	}
	        });
	    }
	});
}


function _matchUser (user) {
	var maxMatches = 0;
	var commonInterest, bestMatchSoFar;

	User.find({}, function (err, allUsers) {
		_.forEach(allUsers, function (otherUser) {
			var commonInterests = user.interests.filter(function (interest) {
				return otherUser.interests.indexOf(interest) !== -1;
			});

			if (commonInterests.length > maxMatches) {
				if (!otherUser.matched && (user.name !== otherUser.name || user.email !== otherUser.email)) {
					maxMatches = commonInterests.length;
					bestMatchSoFar = otherUser;
				}
			}
		});

		if (bestMatchSoFar) {
			var commonInterests = user.interests.filter(function (interest) {
				return bestMatchSoFar.interests.indexOf(interest) !== -1;
			});
			Interest.findById(commonInterests[0], function (err, commonInterest) {
				_sendEmail(user, bestMatchSoFar, commonInterest);
				_sendEmail(bestMatchSoFar, user, commonInterest);
			});
		}
	});
}


var create = function (req, res) {
	var user = req.body;
	var interestIds = [];

	async.each(user.interests, function (interest, done) {
		Interest.findOne({'name': interest.toLowerCase()}, function (err, interestDoc) {
			if (interestDoc) {
				interestIds.push(mongoose.Types.ObjectId(interestDoc._id));
				done();
			} else {
				var newInterest = new Interest({name: interest.toLowerCase()});
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
				_matchUser(userModel);
			} else {
				console.log(err);
			}
		});
	});
};


module.exports = {
	create: create
};