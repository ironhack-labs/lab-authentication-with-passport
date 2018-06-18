const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  let controls = ""
  if (req.user) {
    controls = '<a href="/logout">Log out</a>'
} else {
  controls = '<a href="/signup">Sign Up</a> | <a href="/login">Login</a>'
}
  res.render('index', {controls});
});

module.exports = router;
