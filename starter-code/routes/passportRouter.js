const express        = require("express");
const passportRouter = express.Router();
const User = require('../models/user')
const passport = require('../helpers/passport')



passportRouter.get('/logout', (req,res)=>{
    req.logOut()
    res.redirect('/login')
})

//Middleware
function isAuth(req,res,next){
  if(req.isAuthenticated()) return res.redirect('/')
    return next()
}

passportRouter.post('/login', passport.authenticate('local'), (req,res,next)=>{
  console.log(req.isAuthenticated())
  res.redirect('/')
})


passportRouter.get('/login', isAuth, (req,res,next)=>{
  res.render('passport/login')
})

// Add passport 
passportRouter.post('/signup', (req,res,next)=>{
  User.register(req.body, req.body.password)
      .then(()=>{
        res.redirect('/login')
      })
      .catch(e=>next(e))
})

passportRouter.get('/signup', (req,res,next)=>{
  res.render('passport/signup')
})



const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});


module.exports = passportRouter;