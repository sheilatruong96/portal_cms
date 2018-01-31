var mongoose = require('mongoose');

var pageSchema = mongoose.Schema({
	title: {type: String, required: true},
	url: {type: String, required: true, unique: true},
	content: {type: String, required: true},
	updateDate: {type: Date},
	user: {type: Object, required: true},
	visibility: {type: Boolean, required: true},
});

module.exports = mongoose.model('page', pageSchema);
