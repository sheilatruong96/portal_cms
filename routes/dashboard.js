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

router.get('/editPage/:url/:title', function(req, res){
  pagesModel.findOneAndUpdate({
    url: req.params.url,
    "user._id": req.user._id
  },
  {
    $set: {edit: true}
  },
  function(err, page) {
    if (err) res.send(err);
  }
);

  pagesModel.findOne({"user._id": req.user._id, url: req.params.url, title: req.params.title.trim()},
  function(err, page) {
    if (err) res.send(err);
    if (page) {
      res.render('editPage', {
        user: page
      });
    }
  }
  );
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

router.get('/visibility/:url', function(req, res){
  pagesModel.findOne({
    url: req.params.url.trim(),
    "user._id": req.user._id
  },
    function(err, page) {
      if (err) res.send(err);
      else {
        if (page.visibility) {
            pagesModel.findOneAndUpdate({
              url: page.url,
              "user._id": page.user._id
            },
            {
              $set: {visibility: false}
            },
            function(err, page) {
              if (err) res.send(err);
              res.redirect('/admin');
            }
          );
        }
        else {
            pagesModel.findOneAndUpdate({
              url: page.url,
              "user._id": page.user._id
            },
            {
              $set: {visibility: true}
            },
            function(err, page) {
              if (err) res.send(err);
              res.redirect('/admin');
            }
          );
        }
      }
    });
});



router.get('/editPage', function(req, res) {
  res.render('editPage'); //views ejs file
});


router.get('/editAccount', function(req, res) {
  res.render('editAccount'); //views ejs file
});

router.post('/updateAccInfo', function(req, res) {

  var new_email =  req.body.email;
  var new_password = req.body.password;

  //update the user schema with new email and pw
  userModel.findOne({
    _id: req.user._id
  },
  function(err, users) {
    if (err) res.send(err);
    userModel.findOneAndUpdate({
      _id: users._id,
      email: users.email,
      password: users.password
    },
    {
      $set: {email: new_email, password: new_password}
    },
    function(err, user) {
      if (err) res.send(err);
    });
  });


  pagesModel.updateMany(
    {"user._id": req.user._id},
    {$set:{"user.email": new_email}},
  function(err, page) {
    if (err) res.send(err);
    res.redirect('/admin');
  }
  );

  req.session.user.email = new_email;

});


router.post('/addPage',  function(req, res) {
  pagesModel.findOneAndUpdate({
    "user._id": req.user._id,
    edit: true
  },
  {
    $set: {
      title: req.body.title,
      url: req.body.url,
      content: req.body.content,
      user: req.user,
      updateDate: new Date(),
      visibility: true,
      edit: false
    }
  },
  function(err, page) {
    if (err) res.send(err);

    if (!page) {
      var newPage = new pagesModel({
        title: req.body.title,
        url: req.body.url,
        content: req.body.content,
        user: req.user,
        updateDate: new Date(),
        visibility: true,
        edit: false
      });

      newPage.save(function(err, user) {
        if (err) return console.error(err);
        res.redirect('/admin');
      });
    }
  }
);

  res.redirect('/admin');


	// var newPage = new pagesModel({
	// 	title: req.body.title,
	// 	url: req.body.url,
	// 	content: req.body.content,
  //   user: req.user,
  //   updateDate: new Date(),
  //   visibility: true,
  //   edit: false
	// });
  //
	// newPage.save(function(err, user) {
	// 	if (err) return console.error(err);
	// 	res.redirect('/admin');
	// });
});

router.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/auth');
});

module.exports = router;
