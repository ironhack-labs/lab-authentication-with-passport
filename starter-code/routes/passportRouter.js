const express      = require("express")
const router       = express.Router()
const User         = require("../models/user")
const bcrypt       = require("bcrypt")
const bcryptSalt   = 10
const ensureLogin  = require("connect-ensure-login")
const passport     = require("passport")
const debug        = require('debug')('app')



router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user })
})

router.get("/signup", (req, res) => {
  res.render("passport/signup")
})


router.post("/signup", (req, res, next) => {
  const username = req.body.username
  const password = req.body.password

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" })
    return
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/signup", { message: "The username already exists" })
      return
    }

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    debug("User created")

    const newUser = new User({
      username,
      password: hashPass
    })
    .save()
    .then(user => res.redirect('/'))
    .catch(e => res.render("auth/signup", { message: "Something went wrong" }))

  })
})

router.get('/login',(req,res) =>{
  res.render('passport/login',{ message: req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.post('/logout',(req,res) =>{
  req.logout();
  res.redirect("/");
});






module.exports = router
