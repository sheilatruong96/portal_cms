var express = require('express');
var router = express.Router();
var pagesModel = require('../models/page');
var auth = require('../utils/auth');


router.use(auth.requireLogin);



router.get('/:page', function(req, res) {
	pagesModel.findOne(
	{ url: req.params.page.trim()},
		function(err, page) {
			if (err) res.send(err);
			if (page.visibility) {
				// res.render('template', {
				// 	title: page.title,
				// 	content: page.content
				// });
				pagesModel.find({"user._id": req.user._id}, function(err, info){
					if (err) return res.send(err);
					if (info) {
						res.render('template', {
							user: info,
							title: page.title,
							content: page.content
						});
					};
				});
			} else {
				res.status(404).send('404 - Not found');
			}
		}
	);


});

router.get('/', function(req, res) {
	res.render('adminAuth');
});


module.exports = router;
