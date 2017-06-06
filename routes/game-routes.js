const express = require('express');
const ensure = require('connect-ensure-login');
const Game = require('../models/game-model.js');
const User = require('../models/user-model.js');
const Forum = require('../models/forum-model.js');
const Review = require('../models/review-model.js');
const multer = require('multer');
const upload = multer({ dest: './public/img/' });

const router = express.Router();

router.get('/games/new',
  ensure.ensureLoggedIn('/login'),
  (req, res, next) => {
  res.render('games/new-game-view.ejs');
});

router.post('/games', upload.single('photo'),
  ensure.ensureLoggedIn('login'),
  (req, res, next) => {
    const gameName = req.body.gameName;
    const gameDescription = req.body.gameDescription;
    const photo = req.file;

    if (gameName === "" || gameDescription === ""){
      res.render('games/new-game-view.ejs', {
        errorMessage: 'Please include game title and description'
      });
      return;
    }

    // if (!photo){
    //   res.render('games/new-game-view.ejs', {
    //     errorMessage: 'Please upload a cover picture'
    //   });
    //   return;
    // }

    const theGame = new Game({
      name: req.body.gameName,
      desc: req.body.gameDescription,
      pic_path: `/img/${req.file.filename}`,
      pic_name: req.file.originalname,
      owner: req.user._id,
      youtubeId: req.body.gameYoutube
    });

    theGame.save((err) => {
      if (err) {
        next(err);
        return;
      }

      req.flash('success', 'Your game Title was created');

      res.redirect('/games');
    });
  }

);

router.get('/admin/games', ensure.ensureLoggedIn('login'), (req, res, next) => {

  Game.find({owner: req.user._id}, (err, gamesList) => {
    if (err) { return next(err); }

    res.render('games/games-list-view.ejs', { games: gamesList,
    successMessage: req.flash('success')
   });
  });

});

router.get('/games/:id', (req, res, next) => {
    //                         |
  const gameId = req.params.id;

    // db.products.findOne( { _id: productId } )
  Game.findById(gameId, (err, theGame) => {
    if (err) {
      next(err);
      return;
    } res.render('games/game-details-view.ejs', {
      successMessage: req.flash('success'),
      errorMessage: req.flash('error'),
      game: theGame,
      layout: 'layout-games.ejs',
    });
  });
});

router.get('/games', (req, res, next) => {
  Game.find((err, theGame) => {
    if(err) {
      next(err);
      return;
    } res.render('games/all-games-view.ejs',{
      successMessage: req.flash('success'),
      errorMessage: req.flash('error'),
      games: theGame,
      pageTitle: 'RAWBOX GAMES',
      layout: 'layout-other.ejs',
    });
  });
});

router.post('/games/:id/upvote', ensure.ensureLoggedIn('/login'), (req, res, next) => {
  const gameId = req.params.id;

  Game.findById(gameId, (err, theGame) => {
    if (err) {
      next(err);
      return;
    } else if (theGame.upvotes > 0) {
      console.log(theGame);
      Game.findOne({ upvotesId: req.user._id } , (err, foundUpvote) => {
        console.log('------------------------------>');
        console.log(foundUpvote);
        if(foundUpvote) {
          req.flash('error', 'You already posted an upvote for this game 😤');
          res.redirect(`/games/${gameId}`);
          // res.render('user/edit-profile-view.ejs');
          return;
        } else {
          var currentUpvotes = theGame.upvotes;
          theGame.upvotes = currentUpvotes + 1;
          theGame.upvotesId.push(req.user._id);
          theGame.save((err) => {
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
      var currentUpvotes = theGame.upvotes;
      theGame.upvotes = currentUpvotes + 1;
      theGame.upvotesId.push(req.user._id);
      theGame.save((err) => {
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

module.exports = router;
