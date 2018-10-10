const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");

router.get( `/signup`, (req,res) => res.render(`passport/signup`, {signup: true}) );

router.post(`/signup`, (req,res) => {
  const
    username = req.body.username,
    password = req.body.password
  ;
  if (username === `` || password === ``) return res.render(`passport/signup`, {errorMessage: `All fields are required`});
  User
    .findOne({username})
    .then(user => {
      const
        salt     = bcrypt.genSaltSync(bcryptSalt),
        hashPass = bcrypt.hashSync(password, salt),
        newUser = User({
          username,
          password: hashPass
        })
      ;
      if (user !== null) return res.render(`passport/signup`, {errorMessage: `User already exists`, signup:true});
      User
        .create(newUser)
        .then( () => res.redirect(`/login`) )
    })
  ;
});

router.get( `/login`, (req,res) => res.render(`passport/login`, {errorMessage: req.flash(`error`), login:true}) );

router.post(`/login`, passport
  .authenticate(`local`, {
    successRedirect: `/private-page`,
    failureRedirect: `/login`,
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get(`/private-page`, ensureLogin.ensureLoggedIn(), (req, res) => res.render("passport/private", { user: req.user }) );

router.get(`/logout`, (req, res) => {
  req
    .logout()
    .redirect("/login")
  ;
});

module.exports = router;