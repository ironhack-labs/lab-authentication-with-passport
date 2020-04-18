const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res) => res.render('index'));


let loggedInUser = (req, res, next) => {
    // req.user // passport makes this available 
    if (req.user) {
      next()
    } else {
      res.redirect('/')
    }
  }


module.exports = router;
