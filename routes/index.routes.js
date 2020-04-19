const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {

    // req.user // passport makes this available 
    res.render('index', { user: req.user });
  
});

let loggedInUser = (req, res, next) => {
    // req.user // passport makes this available 
    if (req.user) {
      next()
    } else {
      res.redirect('/login')
    }
  }



module.exports = router;
