const express = require('express');
const router = express.Router();
// TODO: Require user model

// TODO: Add bcrypt to encrypt passwords

// TODO: Add the /signup routes (GET and POST)

passportRouter.get("/private-page", (req, res) => {
  if (!req.user) {
    res.redirect('/login');
    return;
  }

  res.render("passport/private", { user: req.user });
});

module.exports = router;
