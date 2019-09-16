module.exports.checkLogin = (req, res, next) => {
  if (req.isAuthenticated())next()
  else res.redirect("/login")
}