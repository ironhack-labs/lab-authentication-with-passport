module.exports = function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect(`/${req.user.role.toLowerCase()}/private`);
    }
  };
};