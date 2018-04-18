const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");



// /////////////////////////////
// SIGNUP PROCESS
// /////////////////////////////

router.get( "/signup", ( req, res, next ) => {
  res.render( "passport/signup" );
});

router.post( "/process-signup", ( req, res, next ) => {
  
  const { username, password } = req.body;

  if( password === "" ) {
    res.redirect( "/signup" );
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const encryptedPassword = bcrypt.hashSync( password, salt );

  User.create({ username, encryptedPassword })
    .then(() => {
      res.redirect( "/" );
    })
    .catch(( err ) => {
      next( err );
    });
});


// /////////////////////////////
// LOGIN PROCESS
// /////////////////////////////

router.get( "/login", ( req, res, next ) => {
  res.render( "passport/login" );
});

router.post( "/process-login", ( req, res, next ) => {
  const { username, password, encryptedPassword } = req.body;

  User.findOne({ username })
    .then(( userDetails ) => {

      if( !userDetails ) {
        res.redirect( "/signup" );
        return;
      }

      const { encryptedPassword } = userDetails;

      if( !bcrypt.compareSync( password, encryptedPassword )) {
        res.redirect( "/login" );
        return;
      }

      req.login( userDetails, () => {
        res.redirect( "/private-page" );
      })

    })
    .catch(( err ) => {
      next( err );
    })
})


router.get(
  "/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { luke: req.user });
});


module.exports = router;