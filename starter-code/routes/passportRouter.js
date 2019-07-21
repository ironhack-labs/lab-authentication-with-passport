const express        = require("express");
const passportRouter = express.Router();
const passport      = require ('../middlewars/passport')
const {getSignup, postSignup} = require('../controllers/passportControllers')
// Require user model
router.get('/signup', getSignup)
router.post('/signup', postSignup)

// Add bcrypt to encrypt passwords

// Add passport 


const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;