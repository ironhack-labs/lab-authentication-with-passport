const express = require('express');
const bcrypt = require('bcrypt');

const User = require("../models/user.js");
const router  = express.Router();




/* GET home page */
router.get('/', (req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  if (req.user) {
    console.log("LOGGED IN")
  }
  else {
    console.log("Logged OUT")
  }
  res.render('index');
});

router.get("/settings", (req, res, next) => {
  // 
  if (!req.user) {
    //redirect away if you are not logged in
    req.flash("error", "Unknown email");
    res.redirect("/login");
    return;
  }
  res.render("settings-page.hbs");
});





module.exports = router;
