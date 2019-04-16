const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  if (req.user) 
  {
    let username = req.user.username;
    res.render('index', {name: username});
  }
  else {res.render('index');}
});

module.exports = router;

