var mongoose = require('mongoose');

var pageSchema = mongoose.Schema({
	title: {type: String, required: true},
	url: {type: String, required: true},
	content: {type: String, required: true},
	updateDate: {type: Date},
	user: {type: Object, required: true}
	// email: String
});

module.exports = mongoose.model('page', pageSchema);
