exports.isLogged = function(req, res, next) {
  if (!req.isAuthenticated()) return res.redirect("/login");

  const { role } = req.user;
  let internalRole;
  switch (role) {
    case "Boss":
      internalRole = "admin";
      break;
    case "TA":
      internalRole = "staff";
      break;
    case "Developer":
      internalRole = "staff";
      break;
    default:
      internalRole = "user";
      break;
  }

  req.user.internalRole = internalRole;

  next();
};

exports.hasRole = function(role) {
  return function(req, res, next) {
    if (req.user.role !== role) return res.redirect("/login");
    next();
  };
};
