var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/editPage', function(req, res, next) {
  res.render('editPage'); //views ejs file
});

module.exports = router;
