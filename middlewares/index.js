exports.enssureLogin = route => (req, res, next)=>{
  if(req.user){
    console.log(req.user)
    next()
  }else{
    res.redirect(route)
  }
}