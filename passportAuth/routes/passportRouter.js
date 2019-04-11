const express        = require("express");
const passportRouter = express.Router();
const authController = require('../controllers/auth.controller')
// Require user model

// Add bcrypt to encrypt passwords

// Add passport 

const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get('/signup', authController.signup)
passportRouter.post('/signup', authController.doSignup)


module.exports = passportRouter;