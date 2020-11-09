const express = require('express'),
  router = express.Router(),
  chalkAnimation = require('chalk-animation'),
  app = express();
// Require user model

// Add bcrypt to encrypt passwords

// Add passport

const ensureLogin = require('connect-ensure-login');
//Add a new GET route to your routes/auth.routes.js file with the path /signup and point it to your views/auth/signup.hbs file.
router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

router.get('/signup', (req, res) => {
  res.render('auth/signup', { user: req.user });
});

module.exports = router;

// app.listen(3000, () => chalkAnimation.rainbow('running on port 3000  🔊'));
