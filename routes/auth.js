var express = require('express');
var userModel = require('../models/user');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('adminAuth'); //views ejs file
});

router.post('/register', function(req, res) {
	var newUser = new userModel({
		email: req.body.email,
		password: req.body.password,
	});

	newUser.save(function(err, user) {
		if (err) return console.error(err);
    req.session.user = user;
		res.redirect('/admin');
	});
});



router.post('/login', function(req, res) {
	userModel.findOne({email: req.body.email, password: req.body.password}, function(err, user){
    if(err) {
    	console.error(err);
    	res.render('adminAuth', {authError: 'Something went wrong!'});
    }
    if (user) {
      req.session.user = user;
    	res.redirect('/admin');
    } else {
    	res.render('adminAuth', {authError: 'Invalid Username or Password'});
    }
  });

});











module.exports = router;
