/*jshint esversion: 6 */

module.exports = {
  setCurrentUser: function(req, res, next) {
    if (req.isAuthenticated()) {
      res.locals.currentUser = req.user;
      res.locals.isUserLoggedIn = true;
    } else {
      res.locals.isUserLoggedIn = false;
    }
    next();
  },
  checkLoggedIn: (redirectPath) => {
    return (req, res, next) => {
      console.log('req checkLoggedIn', req);
      if (req.isAuthenticated()) {
        next();
      } else {
        res.redirect(redirectPath);
      }
    };
  }
};
