const express = require('express'),
  router = express.Router(),
  chalkAnimation = require('chalk-animation'),
  app = express();
// Require user model

// Add bcrypt to encrypt passwords

// Add passport

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});
router.get('/signup', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('views/auth/signup.hbs', { user: req.user });
});

module.exports = router;

// app.listen(3000, () => chalkAnimation.rainbow('running on port 3000  🔊'));
