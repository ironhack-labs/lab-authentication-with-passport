const isLoggedIn = (redirectRoute = "/login") => (req, res, next) => {
  if (req.user) {
    return next();
  } else {
    req.flash("error", "You are not logged in");
    return res.redirect(redirectRoute);
  }
};

const isLoggedOut = (redirectRoute = "/") => (req, res, next) => {
  if (!req.user) {
    return next();
  } else {
    req.flash("error", "You are already logged in");
    return res.redirect(redirectRoute);
  }
};

module.exports = {
  isLoggedIn,
  isLoggedOut
};
