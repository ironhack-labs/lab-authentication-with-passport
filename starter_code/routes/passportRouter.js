const router   = require('express').Router()
const User     = require('../models/User')
const passport = require('passport')

const estaLoggeadoPerro = (req,res,next)=>{
  if (req.isAuthenticated()){
    return next()
  }else{
    res.redirect('/login')
  }
}

router.get('/signup',(req,res,next)=>{
  res.render('./signup')
})

router.post('/signup',(req,res,next)=>{
  User.register(req.body, req.body.password)
  .then(user=>{
    res.redirect('/login')
  })
  .catch(error => next(error))
})

router.get('/login',(req,res,next)=>{
  res.render('./login')
})
///forma de autenticarse con passport para ahoraarte todo el pedo de antes
router.post('/login',passport.authenticate('local'),(req,res,next)=>{
  console.log('req.user')
  res.redirect('/profile')
})
router.get('/logout',(req,res)=>{
  req.logout()
  res.redirect('/')
})

router.get('/profile', estaLoggeadoPerro, (req,res)=>{
  res.send('Awebo')
})

})



module.exports = router