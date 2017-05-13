const express = require('express');
const ensure = require('connect-ensure-login');
const User = require('../models/user-model.js');

const routerThingy = express.Router();

routerThingy.get('/profile/edit',
  ensure.ensureLoggedIn('/login'),
  (req, res, next) => {
  res.render('user/edit-profile-view.ejs', {
    successMessage: req.flash('success'),
  });
});

routerThingy.post('/profile/edit',

  ensure.ensureLoggedIn('/login'),

  (req, res, next) => {
    const profileName = req.body.profileName;
    const profileUsername = req.body.profileUsername;
    const currentPassword = req.body.profileCurrentPassword;
    const newPassword = req.body.profileNewPassword;

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
          res.render('user/edit-profile-view.ejs', {
            errorMessage: 'Username already taken. 😤'
          });
          return;
        }

        // const profileChanges = {
        //   name: req.body.profileName,
        //   username: req.body.profileUsername
        // };

        // add updates from form
        req.user.name = req.body.profileName;
        req.user.username = req.body.profileUsername;

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


module.exports = routerThingy;
