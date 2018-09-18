const router = require('express').Router()
const User = require('../models/User')
const passport = require('passport')

const estaLogueado = (req,res,next)=>{
  if(req.isAuthenticated()){
      next()
  } else{
      res.redirect('/passport/login')
  }
}

router.get('/signup', (req, res) => {
  res.render('passport/signup')
})
router.post('/signup',(req,res,next)=>{
  User.register(req.body,req.body.password)
  .then(user=> {
      res.redirect('/passport/login')
  })
  .catch(e=> next(e))
})

router.get('/login',(req,res,next)=>{
  res.render('passport/login')    
})
/*
router.post('/login',passport.authenticate('local'),(req,res,next)=>{ //passport .authenticate middleware - función intermedia para preguntar a la bd si el user ya existe o no
  //Si el user existe y se logueó bien:
  //res.send('Success')
  console.log(req.user) //req.user estará disponible durante toda la aplicación
  res.redirect('/passport/private')
})
*/
router.get('/private',estaLogueado,(req,res,next)=>{
  return res.send(req.user.email) 
})

router.get('/logout',(req,res)=>{
  req.logOut()
  res.redirect('/')
})

module.exports = router;