var mongoose = require('mongoose');

var pageSchema = mongoose.Schema({
	title: String,
	url: String,
	content: String,
	email: String
});

module.exports = mongoose.model('page', pageSchema);
