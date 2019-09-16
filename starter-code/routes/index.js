const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  if(req.isAuthenticated()) {
    res.render('index', {userLogged: true});
    return
  } else {
    res.render("index")
  }
});

module.exports = router;
