const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");
const LocalStrategy  = require('passport-local').Strategy;

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username: username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }
    return next(null, user);
  });
}));


router.get('/signup', (req, res, next) => {
  res.render('../views/passport/signup.hbs')
});

router.post('/signup', (req, res, next) => {
  if (req.body.password1 !== req.body.password2) 
    return res.render('signup',  {error: 'la cagaste'});
  bcrypt.genSalt(bcryptSalt, (err, salt) => {
    req.body.password = bcrypt.hashSync(req.body.password1, salt);
    User.create(req.body)
    .then(r => {
      res.redirect('/login');
    })
    .catch(e => next(e));
  });
});

router.get('/login', (req, res, next) => {
  res.render('../views/passport/login.hbs');
});

router.post("/login", passport.authenticate('local', {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = router;


