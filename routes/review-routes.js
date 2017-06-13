const express = require('express');
const ensure = require('connect-ensure-login');
const User = require('../models/user-model.js');
const Game = require('../models/game-model.js');
const Review = require('../models/review-model.js');

const reviewRoutes = express.Router();


// reviewRoutes.get('/games/:gameId/reviews/new', (req, res, next) => {
//   const myGameId = req.params.gameId;
//
//   Game.findById(myGameId, (err, theGame) => {
//     if (err) {
//       next(err);
//       return;
//     }
//
//     res.render('reviews/new-review-view.ejs', {
//       game: theGame
//     });
//   });
// });

reviewRoutes.post('/games/:gameId/reviews', ensure.ensureLoggedIn('/login'),(req, res, next) => {
  const myGameId = req.params.gameId;
  const authorId = req.user._id;

  Game.findById(myGameId, (err, theGame) => {
    if (err) {
      next(err);
      return;
    }
    User.findById(req.user._id, (err, theUser) => {

      //     REQUIRES THE REVIEW MODEL
      //                     |
    const theReview = new Review({
      content: req.body.reviewContent,
      stars: req.body.reviewStars,
      authorId: req.user._id,
      gameId: req.params.gameId,
      author: [theUser],
      authorName: req.user.name,
      authorPic: req.user.pic_path,
      authorF: req.user.facebookID
    });



    theReview.save((err, review) => {
      if (err) {
        res.render('games/game-details-view.ejs', {
          review: theReview,
          validationErrors: theReview.errors
        });
        return;
      }
      const reviewId = review.id;
      console.log('------------------------------------>');
      console.log(reviewId);
      theGame.reviews.push(review);
      theGame.save((err) => {
        if (err) {
            console.log(theGame.errors);
            console.log(theGame.reviews);

          res.render('games/game-details-view.ejs', {
            game: theGame,
            validationErrors: theGame.errors
          });
          return;
        }
        req.flash('success', 'Review Posted');
        res.redirect(`/games/${myGameId}`);
      });

    });
    });
  });
});

reviewRoutes.get('/profile/reviews', ensure.ensureLoggedIn('login'), (req, res, next) => {

  Review.find({authorId: req.user._id}, (err, reviewsList) => {
    if (err) { return next(err); }

    res.render('reviews/reviews-list-view.ejs', { reviews: reviewsList,
    successMessage: req.flash('success')
   });
  });

});

reviewRoutes.post('/user/reviews/edit',
  ensure.ensureLoggedIn('/login'),

  (req, res, next) => {
    const reviewId = req.body.reviewId;
    const newContent = req.body.reviewContent;
    const newStars = req.body.reviewStars;

    Review.findById(
      reviewId,
      (err, foundReview) => {
        if (err) {
          next(err);
          return;
        }

        foundReview.content = newContent;
        foundReview.stars = newStars;

        // save updates!
        foundReview.save((err) => {
          if (err) {
            next(err);
            return;
          }
          req.flash('success', 'Changes saved. 👻');
          res.redirect('/profile/reviews');
        });
      }
    );
  }
);

reviewRoutes.post('/user/reviews/:id/delete', (req, res, next) => {
    //                          |
  const reviewId = req.params.id;

    // db.products.deleteOne({ _id: productId })
  Review.findByIdAndRemove(reviewId, (err, theReview) => {
    if (err) {
      next(err);
      return;
    } Game.update(theReview.gameId,
                      { $pull:
                             { reviews:reviewId }
                      }, (err) => {
    req.flash('success', 'Review Removed. 👻');
    res.redirect('/profile/reviews');
  });
  });
});

reviewRoutes.post('/:gameId/:id/upvote', ensure.ensureLoggedIn('/login'), (req, res, next) => {
  const reviewId = req.params.id;
  const gameId = req.params.gameId;

  Review.findById(reviewId, (err, theReview) => {
    if (err) {
      next(err);
      return;
    } else if (theReview.upvotes > 0) {
      console.log(theReview);
      Review.findOne({ upvotesId: req.user._id } , (err, foundUpvote) => {
        console.log('------------------------------>');
        console.log(foundUpvote);
        if(foundUpvote) {
          req.flash('error', 'You already posted an upvote for this review 😤');
          res.redirect(`/games/${gameId}`);
          // res.render('user/edit-profile-view.ejs');
          return;
        } else {
          var currentUpvotes = theReview.upvotes;
          theReview.upvotes = currentUpvotes + 1;
          theReview.upvotesId.push(req.user._id);
          theReview.save((err) => {
            if (err) {
              next(err);
              return;
            }
            req.flash('success', 'Thank you for upvoting! 👻');
            res.redirect(`/games/${gameId}`);
            return;
          });
        }
      });
    } else {
      var currentUpvotes = theReview.upvotes;
      theReview.upvotes = currentUpvotes + 1;
      theReview.upvotesId.push(req.user._id);
      theReview.save((err) => {
        if (err) {
          next(err);
          return;
        }
        req.flash('success', 'Thank you for upvoting! 👻');
        res.redirect(`/games/${gameId}`);
      });
    }
  });

});



module.exports = reviewRoutes;
