var requireLogin = function (req, res, next) {
  console.log("require login ", req.user);
  if (!req.user) {
    res.redirect('/auth');
  } else {
    next();
  }
};
module.exports = {
  requireLogin
};
