const isLoggedIn = (redirectRoute = "/auth/login") => (req, res, next) => {
  if (req.user) return next();
  else {
    req.flash("info", "You must to be login");
    return res.redirect(redirectRoute);
  }
};

const isLoggedOut = (redirectRoute = "/") => (req, res, next) => {
  if (!req.user) return next();
  else {
    req.flash("info", "You are already logged in");
    return res.redirect(redirectRoute);
  }
};

module.exports = {
  isLoggedIn,
  isLoggedOut
};
