const isLoggedIn = (redirectRoute = "/") => (req, res, next) => {
  console.log(req.user);
  if (req.user) {
    return next();
  } else {
    // req.flash("This is protected, please login first");
    return res.redirect(redirectRoute);
  }
};

const isLoggedOut = (redirectRoute = "/") => (req, res, next) => {
  if (!req.user) {
    return next();
  } else {
    // req.flash("You are already logged in");
    return res.redirect(redirectRoute);
  }
};

module.exports = {
  isLoggedIn,
  isLoggedOut
};
