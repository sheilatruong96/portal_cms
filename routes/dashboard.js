var express = require('express');
var router = express.Router();
var pagesModel = require('../models/page');
var userModel = require('../models/user');

var auth = require('../utils/auth');

router.use(auth.requireLogin);

router.get('/', function(req, res) {
  pagesModel.find({"user._id": req.user._id}, function(err, info){
    if (err) return res.send(err);
    if (info) {
      console.log("this is info", info);
      res.render('dashboard', {
        user: info
      });
    };
  });



});



router.get('/editPage/:_id', function(req, res){
  pagesModel.findOne({"user._id": req.user._id, _id: req.params._id},
  function(err, page) {
    if (err) res.send(err);
    if (page) {
      res.render('editPage', {
        page: page
      });
    }
  }
  );
});

router.post('/editPage/editExist/:_id', function(req, res){
  pagesModel.findOneAndUpdate ({
     "user._id": req.user._id,
     _id: req.params._id.trim()
   },
   {
     $set: {
       title: req.body.title,
       url: req.body.url,
       content: req.body.content,
       user: req.user,
       updateDate: new Date(),
       visibility: true,
     }
   },
   function(err, page) {
     if(err){
       if (err.code === 11000) { //duplicate url
             res.render("editPage", {
               page: {
                 title: req.body.title.trim(),
                 content: req.body.content.trim(),
                 url: ''
               },
               err: `URL already exists (${req.body.url.trim()}). Try another`
             })
       } else {
          return console.error(err);
        }
      }
     else {
       res.redirect('/admin');
     }
   });
});

router.get('/addPage', function(req,res){
  res.render("editPage", {
    page: {
      title: '',
      url: '',
      content: '',
      user: '',
      updateDate: new Date(),
      visibility: true
    }
  });
});

router.post('/addPage/newPage', function(req, res){
  var newPage = new pagesModel({
       title: req.body.title,
       url: req.body.url,
       content: req.body.content,
       user: req.user,
       updateDate: new Date(),
       visibility: true,
     });

     newPage.save(function(err, user) {
       if(err){
         if (err.code === 11000) { //duplicate url
               res.render("editPage", {
                 page: {
                   title: req.body.title.trim(),
                   content: req.body.content.trim(),
                   url: ''
                 },
                 err: `URL already exists (${req.body.url.trim()}). Try another`
               })
         } else {
            return console.error(err);
          }
        }
       else {
         res.redirect('/admin');
       }
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



// router.get('/editPage', function(req, res) {
//   res.render('editPage'); //views ejs file
// });


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
});




router.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/auth');
});

module.exports = router;
