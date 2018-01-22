var express = require('express');
var router = express.Router();
var pagesModel = require('../models/page');
var userModel = require('../models/user');
var requireLogin = require('./requireLogin');

router.get('/', requireLogin, function(req, res) {
  pagesModel.find({email: req.session.user.email}, function(err, email){
    if (err) res.send(err);
    if (email) {
      res.render('dashboard', {
      email: email
    });
  };
});
});


router.get('/editPage',requireLogin, function(req, res) {
  res.render('editPage'); //views ejs file
});


router.get('/editAccount', requireLogin, function(req, res) {
  res.render('editAccount'); //views ejs file
});

router.post('/addPage', requireLogin, function(req, res) {
	var newPage = new pagesModel({
		title: req.body.title,
		url: req.body.url,
		content: req.body.content,
    email: req.session.user.email
	});

	newPage.save(function(err, user) {
		if (err) return console.error(err);
		res.redirect('/admin');
	});
});

router.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/auth');
});

module.exports = router;
