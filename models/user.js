var mongoose = require('mongoose');

var schema = mongoose.Schema({
	email: {type: String, unique: true},
	password: String
});

module.exports = mongoose.model('users', schema);
