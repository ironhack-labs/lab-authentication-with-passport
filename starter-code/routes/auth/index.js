const express = require("express");
const passport = require("passport");

const { isLogged, hasRole } = require("../../middlewares/auth");
const router = express.Router();

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect("/");

    req.logIn(user, err => {
      if (err) return next(err);
      req.app.locals.currentUser = user;
      res.redirect("/profile");
    });
  })(req, res, next);
});

router.get("/profile", isLogged, (req, res) => {
  const { internalRole: role } = req.user;
  res.render(`auth/${role}/profile`);
});
/*TESTS*/

module.exports = router;
