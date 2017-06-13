const express = require('express');
const ensure = require('connect-ensure-login');
const Game = require('../models/game-model.js');
const User = require('../models/user-model.js');
const Forum = require('../models/forum-model.js');
const Reply = require('../models/reply-model.js');
const Review = require('../models/review-model.js');
const multer = require('multer');
const upload = multer({ dest: './public/img/' });

const router = express.Router();


router.post('/:id/forums/new',
  ensure.ensureLoggedIn('/login'),
  (req, res, next) => {
    const forumContent = req.body.forumContent;
    const forumAuthor = req.user._id;
    const forumGame = req.params.id;

    Game.findById(forumGame, (err, theGame) => {
      if (err) {
        next(err);
        return;
      } User.findById(req.user._id, (err, theUser) => {

    const theForum = new Forum({
      content: forumContent,
      authorId: forumAuthor,
      gameId: forumGame,
      author: [theUser],
      authorName: req.user.name,
      authorPic: req.user.pic_path,
      authorF: req.user.facebookID
    });

    theForum.save((err, oneForum) => {
      if (err) {
        next(err);
        return;
      } theGame.forums.push(oneForum);

      theGame.save((err) => {

      req.flash('success', 'Your Forum was created');

      res.redirect(`/games/${forumGame}/forums/${oneForum.id}`);
      });
    });
    });
    });
  }

);

router.get('/games/:gameId/forums/:forumId', (req, res, next) => {
    //                         |
  const gameId = req.params.gameId;
  const forumId = req.params.forumId;

    // db.products.findOne( { _id: productId } )
  Forum.findById(forumId, (err, theForum) => {
    if (err) {
      next(err);
      return;
    }
    // *********Loop through replies************
    // else if (theGame.reviews.length > 0) {
    //   theGame.reviews.forEach((oneReview) => {
    //     Review.findById(oneReview, (err, theReview) => {
    //     var authorId = theReview.authorId;
    //     User.findById(authorId, (err, theAuthor) => {
    //       res.render('games/game-details-view.ejs', {
    //         successMessage: req.flash('success'),
    //         errorMessage: req.flash('error'),
    //         game: theGame,
    //         review: theReview,
    //         author: theAuthor,
    //         layout: 'layout-games.ejs',
    //       });
    //     });
    //   });
    //   });
    // }
    // else {
    Game.findById(gameId, (err, theGame) => {
      if (err) {
        next(err);
        return;
      }  var userId = theForum.authorId;
      // User.findById(userId, (err, theAuthor) => {

      res.render('forums/forum-details-view.ejs', {
        successMessage: req.flash('success'),
        errorMessage: req.flash('error'),
        forum: theForum,
        game: theGame,
        layout: 'layout-forums.ejs',
      });
      // });
    // }
    });



  });
});

module.exports = router;
