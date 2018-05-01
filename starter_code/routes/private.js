const express = require('express');
const router  = express.Router();


router.get("/", (req, res, next) => {
  res.render("/");
});


router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});


router.get("/private", (req, res, next) => {
  const username = req.session.currentUser.username;
  res.render("/private", {username: username});
});

module.exports = router;