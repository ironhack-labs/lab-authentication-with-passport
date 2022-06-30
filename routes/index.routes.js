const express = require('express');
const router = express.Router();

// middleware to protect routes
function loginCheck() {
  return (req, res, next) => {
    // this is how you check for a logged in user in passport
    if (req.isAuthenticated()) {
      next()
    } else {
      res.redirect('/login')
    }
  }
}

/* GET home page */
router.get('/', (req, res) => res.render('index'));

router.get('/profile', (req, res, next) => {
  // this is where passport adds the user to the request object
  // for 'node-basic-auth' this would be req.session.user
  const user = req.user
  res.render('profile', { user: user })
});


module.exports = router;
