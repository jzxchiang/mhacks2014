'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var InterestSchema = new Schema({
	name: {
		type: String,
		default: ''
	}
});

mongoose.model('Interest', InterestSchema);