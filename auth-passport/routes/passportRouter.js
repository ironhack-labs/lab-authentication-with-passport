const router = require('express').Router()
const User = require('../models/User')
const passport =  require('../handlers/passport')
const ensureLogin = require('connect-ensure-login')


router.get('/signup', (req, res, next)=>{
  res.render('passport/signup')
})

router.post('/signup', async(req, res, next)=>{
  try{
    const user =  await User.register({...req.body}, req.body.password)
    res.redirect('/login')
  } catch(e){
    res.send('Ya existe')
  }
})

router.get('/login', (req, res, next)=>{
  res.render('passport/login')
})

router.post('/login', passport.authenticate('local'), (req, res, next)=>{
console.log(req.user, req.session)
res.redirect('/private')
});

router.get('/private', ensureLogin.ensureLoggedIn(), (req, res, next)=>{
  res.render('passport/private', {user: req.user})
})

router.get('/logout', (req, res, next)=>{
  req.logout()
  res.redirect('/login')
})
// Require user model

// Add bcrypt to encrypt passwords

// Add passport 


//const ensureLogin = require("connect-ensure-login");


//passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
 // res.render("passport/private", { user: req.user });
//});

module.exports = router;