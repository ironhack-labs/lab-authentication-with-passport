const express = require('express');
const router = express.Router();

const loggedInUser = require('../helpers/middlewares').loggedInUser
const userIsAdmin = require('../helpers/middlewares').userIsAdmin

/* GET home page */
router.get('/', (req, res, next) => {

  // req.user // passport makes this available 
  res.render('index', { user: req.user });

});

// here user needs to be logged in
router.get('/books', loggedInUser, (req, res, next) => {

  res.send('here be books')
});

// here user needs to be logged in && be an admin
router.get('/movies', loggedInUser, userIsAdmin, (req, res, next) => {
  res.send('here be movies')
});

module.exports = router;