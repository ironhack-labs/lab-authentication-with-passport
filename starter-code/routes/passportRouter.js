const express        = require("express");
const passportRouter = express.Router();
// TODO: Require user model

// TODO: Add bcrypt to encrypt passwords

// TODO: Add /signup route with passport

passportRouter.get("/private-page", (req, res) => {
  if (!req.user) {
    res.redirect('/login');
    return;
  }
  
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;