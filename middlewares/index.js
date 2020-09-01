exports.ensureLogin = route => (req, res, next) => {
  // req.isAuthenticated tambien nos ayuda a revisar si tenemos una sesion
  if (req.user) {
    next()
  } else {
    res.redirect(route)
  }
}