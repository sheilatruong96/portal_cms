var express = require('express');
var router = express.Router();
var auth = require('../utils/auth');

router.use(auth.requireLogin);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('template'); //views ejs file
});


module.exports = router;
