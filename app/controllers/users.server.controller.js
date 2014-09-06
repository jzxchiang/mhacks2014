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

var sendEmail = function (user, matchedUser) {
	var mailOptions = {
	    from: 'MHacks ✔ <nodemailer122895@gmail.com>', // sender address
	    to: user.email, // list of receivers
	    subject: 'Your Match', // Subject line
	    text: 'Hi ' + user.name + ', \n\nYou have been matched with ' + matchedUser.name + '!\n Email: ' + matchedUser.email, // plaintext body
	    html: 'Hi ' + user.name + ', \n\nYou have been matched with ' + matchedUser.name + '!\n Email: ' + matchedUser.email
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
	    }else{
	        console.log('Message sent: ' + info.response);
	    }
	});
};

function _matchUser (user) {
	console.log("matchUser called");
	var maxMatches = 0;
	var bestMatchSoFar;
	User.find({}, function (err, allUsers) {
		console.log('found:' + allUsers);
		_.forEach(allUsers, function (otherUser) {
			console.log('user.interests: ' + user.interests.constructor);
			var matchedInterests = user.interests.filter(function (interest) {
				return otherUser.interests.indexOf(interest) !== -1;
			});			
			// console.log('matchedInterests: ' + user.interests.constructor);


			console.log('matchedInterests: ' + matchedInterests.constructor);
			console.log('matchedInterests length: ' + matchedInterests.length);
			if (matchedInterests.length > maxMatches) {
				maxMatches = matchedInterests.length;
				bestMatchSoFar = otherUser;
			}
		});
		if (bestMatchSoFar) {
			console.log(bestMatchSoFar);
			sendEmail(user, bestMatchSoFar);
			sendEmail(bestMatchSoFar, user);
		}
	});


};


var create = function (req, res) {
	var user = req.body;
	var interestIds = [];
	var newInterestModels = [];

	async.each(user.interests, function (interest, done) {
		Interest.findOne({'name': interest}, function (err, interestDoc) {
			if (interestDoc) {
				console.log('matched: ' + interestDoc._id);
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
		console.log(userModel);
		userModel.save(function (err) {
			if (!err) {
				console.log('saved wihtout error');
				// res.jsonp('Works great!');
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