const express        = require("express");
const passportRouter = express.Router();
// Require user model

// Add bcrypt to encrypt passwords

// Add passport 

passportRouter.get("/private-page", (req, res) => {
  // TODO: only render if authenticated
  
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;
