var express = require('express');
var router = express.Router();
var pagesModel = require('../models/page');
var userModel = require('../models/user');

// fix this
var auth = require('../utils/auth');

router.use(auth.requireLogin);

router.get('/', function(req, res) {
  pagesModel.find({"user._id": req.user._id}, function(err, info){
    if (err) return res.send(err);
    if (info) {
      res.render('dashboard', {
      user: info
    });
  };
});
});

router.get('/delete/:url', function(req, res) {
  pagesModel.remove(
	{ url: req.params.url.trim(),
    "user._id": req.user._id
  },
		function(err, page) {
			if (err) res.send(err);
			else {
        res.redirect('/admin');
			}
		}
	);
});


router.get('/editPage', function(req, res) {
  res.render('editPage'); //views ejs file
});


router.get('/editAccount', function(req, res) {
  res.render('editAccount'); //views ejs file
});

router.post('/addPage',  function(req, res) {
	var newPage = new pagesModel({
		title: req.body.title,
		url: req.body.url,
		content: req.body.content,
    user: req.user,
    updateDate: new Date()

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
