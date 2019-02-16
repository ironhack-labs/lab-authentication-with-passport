const express        = require('express');
const router         = express.Router();
// Require user model
const User           = require('../models/user');


router.get("/private", isLoggedIn, (req, res) => {
  res.render("passport/private", { user: req.user });
});

function isLoggedIn(req, res, next){
  if(req.user){
    next();
  } else  {
    res.redirect('/login');
  }

}

module.exports = router;