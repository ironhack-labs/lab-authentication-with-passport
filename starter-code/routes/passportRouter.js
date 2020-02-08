const express = require("express");
const passportRouter = express.Router();
// Require user model
//const User = require("..models/user");
// Add bcrypt to encrypt passwords

// Add passport 

/*Add a new route to your passportRouter.js file
 with the path /signup and point it to your 
 views/passport/signup.hbs file.
*/
passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});





module.exports = passportRouter;