const express = require("express");
const router = express.Router();
const User = require("../models/User");
// no se requiere el configurado de manera particular
const passport = require("passport");

router.get("/",(req,res)=>{
  res.render("indexLab2");
})

router.get("/login", (req, res, next) => {
  let errMsg = req.flash("error")[0];
  res.render("auth-form", { login: true, err: errMsg });
});

// al authenticate recibe la estrategia
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: "Usuario y/o contraseña invalidos"
  }),
  (req, res) => {
    res.redirect(`/${req.user.role.toLowerCase()}/private`);
  }
);

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/auth");
});

module.exports = router;