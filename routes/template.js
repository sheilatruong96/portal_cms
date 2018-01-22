var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', requireLogin, function(req, res, next) {
  res.render('template'); //views ejs file
});


module.exports = router;
