var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var pageSchema = mongoose.Schema({
	title: String,
	url: String,
});

var pageModel = mongoose.model('page', pageSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dashboard'); //views ejs file
});

router.post('/addPage', function(req, res) {
	var newPage = new pageModel({
		title: req.body.title,
		url: req.body.url,
	});

	newPage.save(function(err, user) { 
		if (err) return console.error(err);
		res.redirect('/admin');
	});
});

module.exports = router;
