const router = require('express').Router()

const User= require('../models/User')

const passport = require('passport')

router.get('/signup', (req, res, next)=>{
  res.render('../views/auth/signup')
})




const estaLoggeadoPerro = (req, res, next) =>{
  if(req.isAuthenticated()){
    next()
} else{
  res.redirect('/auth/login')
}
}



router.post('/signup', (req, res, next)=>{
  User.register(req.body, req.body.password)
  .then(user => {
    res.redirect('/auth/login')
  })
  .catch(error => next(error))
})


router.get('/login', (req, res, next)=>{
  res.render('auth/login')
})


router.get('/logout', (req, res)=>{
  req.logOut()
  res.redirect('/')
})

router.post('/login', passport.authenticate('local'), (req, res, next)=>{

console.log(req.user)
res.redirect('/auth/profile')

})


router.get('/profile', estaLoggeadoPerro, (req, res, next)=>{
  res.send(req.user.email)
  
})




module.exports = router 