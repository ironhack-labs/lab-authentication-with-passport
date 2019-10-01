const express        = require("express");
const passportRouter = express.Router();
// Require user model

// Add bcrypt to encrypt passwords

// Add passport 


const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;