const express = require('express');
const router  = express.Router();
const Game = require('../models/game-model.js');
const Review = require('../models/review-model.js');
const User = require('../models/user-model.js');

/* GET home page. */
router.get('/', (req, res, next) => {
  console.log('HOME ----------------');
  console.log('SESSION (from express-session)', req.session);
  console.log('USER (from passport)', req.user);

//   Game.find((err, gamesList) => {
//     if (err) { return next(err); }
//
//
//
//
//   res.render('index', { games: gamesList,
//     successMessage: req.flash('success'),
//   });
// });

    Game.find((err, theGame) => {
      if (err) {
        next(err);
        return;
      } if (theGame.length > 0) {
        theGame.forEach((oneGame) => {
          if (oneGame.reviews.length > 0) {
            oneGame.reviews.forEach((oneReview) => {
              Review.findById(oneReview, (err, theReview) => {
                if (err) {
                  next(err);
                  return;
                }
                res.render('index', {
                  successMessage: req.flash('success'),
                  games: theGame,
                  review: theReview,
                });
          });
        });
      } else {
              res.render('index', {
                successMessage: req.flash('success'),
                games: theGame,
              });
            }
        });
      }
      else {
        res.render('index', {
          successMessage: req.flash('success'),
          games: theGame
        });
      }



    });
});

module.exports = router;
