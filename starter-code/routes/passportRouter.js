const router = require('express').Router()

// Require user model
const User = require('../models/User');

// Add passport 
const passport = require('../config/passport');

const ensureLogin = require("connect-ensure-login");

router.get('/signup', (req, res, next) => {
  const config={ register: true }
  res.render('passport/signup',config)
});

router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.register({ ...req.body }, req.body.password)
    console.log(user)
    res.redirect('/login')
  } catch (e) {
    console.log(e)
    res.send('El usuario ya existe')
  }
});

router.get('/login',(req,res,next)=>{
  const config={register:false}
  res.render('passport/login',config)
})

router.post('/login', passport.authenticate('local'), (req, res, next) => {
  res.redirect('/private-page')
})


router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = router;