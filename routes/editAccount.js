var express = require('express');
var router = express.Router();


router.get('/editAccount', function(req, res, next) {
  res.render('editAccount'); //views ejs file
});




module.exports = router;
