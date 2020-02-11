const isLoggedIn = (redirectRoute = "/auth/login") => (req, res, next) => {
  console.log(req);
  console.log(req.user);
  return req.user ? next() : res.redirect(redirectRoute);
};

const isLoggedOut = (redirectRoute = "/") => (req, res, next) => {
  return !req.user ? next() : res.redirect(redirectRoute);
};

module.exports = {
  isLoggedIn,
  isLoggedOut
};
