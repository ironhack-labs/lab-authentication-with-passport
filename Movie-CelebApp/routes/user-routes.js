const express  = require('express');
const router   = express.Router();
const User     = require('../models/User');
const bcrypt   = require('bcryptjs');
const passport = require('passport');
const Movie     = require('../models/Movie');



router.get('/signup', (req, res, next)=>{
    res.render('user-views/signup-view', {message: req.flash('error')});
});

router.post('/register', (req, res, next)=>{
     User.findOne({username: req.body.username})
        .then((theUser)=>{
           
            if(theUser !== null){
                req.flash('error', 'sorry, that username is taken');
                // this is essentially equal to req.flash.error = 'sorry that username is taken'
                res.redirect('/signup')
            }

            const salt = bcrypt.genSaltSync(10);
            const theHash = bcrypt.hashSync(req.body.thePassword, salt);

            User.create({
                username: req.body.theUsername,
                password: theHash,
                profilePic:  req.body.image,
                firstName: req.body.first,
                lastName: req.body.last,
                bio: req.body.bio,
                admin: false
            })
            .then((theUser)=>{
                req.login(theUser, (err) => {
                    if (err) {
                        req.flash('error', 'something went wrong with auto login, please log in manually')
                        res.redirect('/login')
                      return;
                    }
            
                    res.redirect('/profile');
                  });        
            })
            .catch((err)=>{
                next(err);
            })
        })
        .catch((err)=>{
            next(err);
        })
});



router.get('/login', (req, res, next)=>{
    res.render('user-views/login', {message: req.flash('error')})
})

// the routes for the get and post do not need to match, in fact in the example above
// i used get /signup and post /register
router.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  }));
  // passport.authenticate calls takes an argument and uses that argument
  // to find which strategy you want to call, in our case its the local strategy
  //defined in app.js


  router.get('/logout', (req, res, next)=>{
      req.logout()
      res.redirect('/');
  })


  router.get('/profile', (req, res, next)=>{
      Movie.find({donor: req.user._id})
      .then((thisPersonsMovies)=>{
          
          res.render('user-views/profile', {user: req.user, Movies: thisPersonsMovies});

      })
      .catch((err)=>{
        next(err);
      })
  })







module.exports = router;
