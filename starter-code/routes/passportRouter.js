const express        = require("express");
const passportRouter = express.Router();
// Require user model
//Está en los controllers
const { getSignup, postSignup, getLogin } = require('../controllers/passportControllers')
const passport = require('../middleware/passport')

// Add bcrypt to encrypt passwords
//Ya está en elpassportControllers

// Add passport 
//Está en el middleware

const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get('/signup', getSignup)
passportRouter.post('/signup', postSignup)

passportRouter.get('/login', getLogin)
passportRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/passport/login',
  passReqToCallback: true,
  failureFlash: true
})) 

module.exports = passportRouter;