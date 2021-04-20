const express = require('express');
const { isLoggedIn} = require('../middlewares');
const router = express.Router();

router.get('/profile', isLoggedIn, (req, res,) => {
  res.render('private');
})

module.exports = router;