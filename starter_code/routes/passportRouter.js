const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const app = express();
const LocalStrategy  = require('passport-local').Strategy;

const passport = require('passport')
const TwitterStrategy = require('passport-twitter').Strategy;

passport.use(new TwitterStrategy({
    consumerKey: "fQg7xydu32zGY9IoQr1WQdzKm",
    consumerSecret: "obsyh2xFdANeccFxgcD6LqwpYKwWO0aPIlcUeuqQgwcpyCXh0r",
    callbackURL: "http://127.0.0.1:3000/auth/twitter/return"
  },
  function(token, tokenSecret, profile, cb) {
    User.findOrCreate({ twitterId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
app.get('/auth/twitter',
  passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/private-page');
  });

  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { successRedirect: '/',
                                       failureRedirect: '/login' }));



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
      return next(null, false, { message: "Wrong username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Wrong password" });
    }
    return next(null, user);
  });
}));

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});



router.get('/signup', (req, res, next) => {
  res.render('../views/passport/signup')
});

router.post('/signup',(req, res, next)=>{
  if (req.body.password1 !== req.body.password2)
      return res.render('../views/passport/signup',  {error: 'Wrong Password'});
    bcrypt.genSalt(bcryptSalt, (err, salt) => {
      req.body.password = bcrypt.hashSync(req.body.password1, salt);
      User.create(req.body)
      .then(r => {
        res.redirect('/login');
      })
      .catch(e => next(e));
    });
  })


router.get('/login', (req, res, next)=>{
  res.render('../views/passport/login');
});

router.post('/login', passport.authenticate('local',{
  successRedirect: "/private-page",
   failureRedirect: "/login",
   failureFlash: false,
   passReqToCallback: true
 }));

 router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
   res.render("passport/private", { user: req.user });
 });


module.exports = router;
