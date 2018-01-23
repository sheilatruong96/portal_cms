var express = require('express');
var router = express.Router();
var pagesModel = require('../models/page');
var auth = require('../utils/auth');


router.use(auth.requireLogin);

// var mongoose = require('mongoose');

// var userSchema = mongoose.Schema({
// 	email: String,
// 	password: String,
// });

// var userModel = mongoose.model('users', userSchema);

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// router.post('/auth/register', function(req, res) {
// 	var newUser = new userModel({
// 		email: req.body.email,
// 		password: req.body.password,
// 	});

// 	newUser.save(function(err, user) {
// 		if (err) return console.error(err);
// 		res.redirect('/admin');
// 	});

// });


router.get('/:page', function(req, res) {
	pagesModel.findOne(
	{ url: req.params.page.trim()},
		function(err, page) {
			if (err) res.send(err);
			if (page) {
				res.render('template', {
					title: page.title,
					content: page.content
				});
			} else {
				res.status(404).send('404 - Not found');
				// next();
			}
		}
	);
});


module.exports = router;
