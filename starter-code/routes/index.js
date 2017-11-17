const express = require('express');
const router  = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  // passport defines "req.user" if the user is logged in
  // ("req.user" is the result of deserialize)
  // res.locals.currentUser = req.user;

  res.render('index');
});

module.exports = router;
