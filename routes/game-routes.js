const express = require('express');
const ensure = require('connect-ensure-login');
const Game = require('../models/room-model.js');
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
    if (!req.file){
      res.render('games/new-game-view.ejs', {
        errorMessage: 'Please upload a cover picture'
      });
      return;
    }
    const theGame = new Game({
      name: req.body.gameName,
      description: req.body.gameDescription,
      pic_path: `/img/${req.file.filename}`,
      pic_name: req.file.originalname,
      owner: req.user._id
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

router.get('/games', ensure.ensureLoggedIn('login'), (req, res, next) => {

  Game.find({owner: req.user._id}, (err, gamesList) => {
    if (err) { return next(err); }

    res.render('games/games-list-view.ejs', { games: gamesList,
    successMessage: req.flash('success')
   });
  });

});

module.exports = router;
