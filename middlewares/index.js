exports.ensureLogin = function (route) {
  return function (req, res, next) {
    if(req.user){
      next()
    }else{
      res.redirect(route)
    }
  }
}