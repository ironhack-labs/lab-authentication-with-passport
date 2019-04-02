const express = require("express");
const router = express.Router();
const User = require("../models/User");
// no se requiere el configurado de manera particular
const passport = require("passport");
const isAuth = require("../helpers/isAuth");
const checkRoles = require("../helpers/checkRoles");

const isAdmin = (req, res, next) => {
  if (req.user.role === "BOSS") {
    return next();
  } else {
    req.logout();
    res.render("admin/auth-admin", {
      login: true,
      err: "Tu cuenta no es administrador"
    });
  }
};

router.get("/login", (req, res, next) => {
  let errMsg = req.flash("error")[0];
  res.render("admin/auth-admin", {
    login: true,
    admin: req.baseUrl.includes("admin"),
    err: errMsg
  });
});

// al authenticate recibe la estrategia
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/admin/login",
    failureFlash: "Usuario y/o contraseña invalidos"
  }),
  isAdmin,
  (req, res) => {
    res.redirect("/admin/private");
  }
);

router.get("/register", (req, res, next) => {
  User.findOne({ role: "BOSS" }).then(user => {
    if (!user)
      res.render("admin/auth-admin", { admin: req.baseUrl.includes("admin") });
    else res.redirect("/admin/login");
  });
});

router.post("/register", (req, res, next) => {
  let { password, passwordConfirm, ...newUser } = req.body;
  if (password !== passwordConfirm) {
    return res.render("admin/auth-admin", {
      err: "Las contraseñas no son las mismas"
    });
  }

  User.register({ role: "BOSS", ...newUser }, password).then(user => {
    res.redirect("/admin/login");
  });
});

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/admin/login");
});

router.get("/private", isAuth, checkRoles("BOSS"), (req, res) => {
  const { user } = req;
  User.find({ $or: [{ role: "TA" }, { role: "DEV" }] }).then(users => {
    res.render("admin/index", { users, user });
  });
});

router.get("/newemp", isAuth, checkRoles("BOSS"), (req, res) => {
  const { user } = req;
  res.render("admin/newemp", { user });
});

router.post("/newemp", isAuth, checkRoles("BOSS"), (req, res) => {
  // using rest operator to collect the rest of parameters
  const { password, passwordConfirm, ...newUser } = req.body;
  if (password !== passwordConfirm) {
    return res.render("admin/newemp", {
      err: "Las contraseñas no son las mismas"
    });
  }

  User.register(newUser, password).then(() => {
    res.redirect("/admin/private");
  });
});

router.post("/:id/delete", isAuth, checkRoles("BOSS"), (req, res) => {
  const { id } = req.params;
  User.findByIdAndRemove(id).then(() => {
    res.redirect("/admin/private");
  });
});

module.exports = router;
