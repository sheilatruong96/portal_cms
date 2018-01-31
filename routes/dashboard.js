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
      res.send(JSON.stringify(page));
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
       console.log("in edit exist sending data now!");
       res.send(JSON.stringify({
         title: req.body.title,
         url: req.body.url,
         _id: req.params._id.trim()
       }));
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
         res.send(JSON.stringify(user));
       }
     });

});


router.delete('/delete/:_id', function(req, res) {
  pagesModel.remove(
	{ _id: req.params._id.trim(),
    "user._id": req.user._id
  },
		function(err, page) {
			if (err) return res.status(500).send(err);
			else {
        res.end();
			}
		}
	);
});



router.get('/visibility/:_id', function(req, res){
  pagesModel.findOne({
    _id: req.params._id.trim(),
    "user._id": req.user._id
  },
    function(err, page) {
      if (err) return res.status(500).send(err);
      else {
        if (page.visibility) {
            pagesModel.findOneAndUpdate({
              _id: page._id,
              "user._id": page.user._id
            },
            {
              $set: {visibility: false}
            },
            function(err, page) {
              if (err) return res.status(500).send(err);
              res.send(JSON.stringify({
                "vis": false,
                "url": page.url,
                "title": page.title,
                "_id": page._id
              }));
            }
          );
        }
        else {
            pagesModel.findOneAndUpdate({
              _id: page._id,
              "user._id": page.user._id
            },
            {
              $set: {visibility: true}
            },
            function(err, page) {
              if (err) return res.status(500).send(err);
              res.send(JSON.stringify({
                "vis": true,
                "url": page.url,
                "title": page.title,
                "_id": page._id
              }));
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
