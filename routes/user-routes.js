const express = require('express');
const ensure = require('connect-ensure-login');
const User = require('../models/user-model.js');
const Game = require('../models/game-model.js');
const Review = require('../models/review-model.js');
const multer = require('multer');
const upload = multer({ dest: './public/img/' });

const routerThingy = express.Router();

routerThingy.get('/profile/edit',
  ensure.ensureLoggedIn('/login'),
  (req, res, next) => {
  res.render('user/edit-profile-view.ejs', {
    successMessage: req.flash('success'),
    errorMessage: req.flash('error')
  });
});

routerThingy.post('/profile/edit', upload.single('photo'),

  ensure.ensureLoggedIn('/login'),

  (req, res, next) => {
    const profileName = req.body.profileName;
    const profileUsername = req.body.profileUsername;
    const currentPassword = req.body.profileCurrentPassword;
    const newPassword = req.body.profileNewPassword;
    const photo = req.file;

    User.findOne(
      { username: profileUsername },
      { username: 1 },
      (err, foundUser) => {
        if (err) {
          next(err);
          return;
        }

        // if there's a user with the username and it's not you
        if (foundUser && !foundUser._id.equals(req.user._id)) {
          req.flash('error', 'Username already taken. 😤');
          res.redirect('/profile/edit');
          // res.render('user/edit-profile-view.ejs');
          return;
        }

        // const profileChanges = {
        //   name: req.body.profileName,
        //   username: req.body.profileUsername
        // };

        // add updates from form
        if(profileName) {
        req.user.name = req.body.profileName;
        }
        if(profileUsername) {
        req.user.username = req.body.profileUsername;
        }


        if (photo) {
          req.user.pic_path = `/img/${req.file.filename}`;
          req.user.pic_name = req.file.originalname;
        }


        // if both passwords are filled and the current password is correct
        if (currentPassword && newPassword && bcrypt.compareSync(currentPassword, req.user.encryptedPassword)) {
          // add new encryptedPassword to the updates
          const salt = bcrypt.genSaltSync(10);
          const hashPass = bcrypt.hashSync(newPassword, salt);
          // profileChanges.encryptedPassword = hashPass;
          req.user.encryptedPassword = hashPass;
        }

        // save updates!
        req.user.save((err) => {
          if (err) {
            next(err);
            return;
          }
          req.flash('success', 'Changes saved. 👻');
          res.redirect('/profile/edit');
        });

        // User.findByIdAndUpdate(
        //   req.user._id,
        //   profileChanges,
        //   (err, theUser) => {
        //     if (err) {
        //       next(err);
        //       return;
        //     }
        //
        //     req.flash('success', 'Changes saved. 👻');
        //
        //     res.redirect('/profile/edit');
        //   }
        // );
      }
    );
  }
);

routerThingy.get('/admin/users', (req, res, next) => {
  // If you are logged in AND and admin LEZ DO THIS
  if (req.user && req.user.role === 'admin') {
    User.find((err, usersList) => {
      if (err) {
        next(err);
        return;
      }

      res.render('user/users-list-view.ejs', {
        users: usersList,
        successMessage: req.flash('success')
      });
    });
  }

  // Otherwise show 404 page
  else {
    next();
  }
});

routerThingy.get('/admin/reviews', (req, res, next) => {
  // If you are logged in AND and admin LEZ DO THIS
  if (req.user && req.user.role === 'admin') {
    Review.find((err, reviewList) => {
      if (err) {
        next(err);
        return;
      } if (reviewList.length > 0) {
        reviewList.forEach((oneReview) => {
        authorId = oneReview.authorId;
        User.findById(authorId, (err, theAuthor) => {
          if (err) {
            next(err);
            return;
          } gameId = oneReview.gameId;
          Game.findById(gameId, (err, theGame) => {
            if (err) {
              next(err);
              return;
            }
            res.render('user/admin-review-view.ejs', {
              reviews: reviewList,
              author: theAuthor,
              game: theGame,
              successMessage: req.flash('success')
            });
          });
        });

      });
    } else {
      res.render('user/admin-review-view.ejs', {
        reviews: reviewList,
        successMessage: req.flash('success')
        });

    }


    });
  }

  // Otherwise show 404 page
  else {
    next();
  }
});

routerThingy.get('/admin', (req, res, next) => {
  // If you are logged in AND and admin LEZ DO THIS
  if (req.user && req.user.role === 'admin') {
        res.render('user/admin-view.ejs', {
          successMessage: req.flash('success')
      });
  }

  // Otherwise show 404 page
  else {
    next();
  }
});

routerThingy.post('/users/:id/admin', (req, res, next) => {
  // If you are logged in AND and admin LEZ DO THIS
  if (req.user && req.user.role === 'admin') {
    User.findByIdAndUpdate(
      req.params.id,
      { role: 'admin' },
      (err, theUser) => {
        if (err) {
          next(err);
          return;
        }

        req.flash('success', `User "${theUser.name}" is now an admin. 😎`);

        res.redirect('/users');
      }
    );
    return;
  }

  // Otherwise show 404 page
  else {
    next();
  }
});


module.exports = routerThingy;
