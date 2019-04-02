const isAuth = (req, res, next) => {
  // metodo para validar que el usuario este autenticado
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect(`/auth/login`);
};

module.exports = isAuth;