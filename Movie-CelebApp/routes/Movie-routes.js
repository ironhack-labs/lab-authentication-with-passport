const express = require('express');
const router  = express.Router();
const Movie    = require('../models/Movie');
const Celebrity  = require('../models/Celebrity');




router.get('/', (req, res, next) => {
    if(!req.user || !req.user.admin){
        req.flash('error', 'page not available');
        res.redirect('/login')
        return;
    } else{

        Movie.find().populate('Celebrity')
        .then((allTheMovies)=>{
            res.render('Movie-views/Movies', {Movies: allTheMovies})
        })
        .catch((err)=>{
            next(err);
        })
    }
});


router.get('/new', (req, res, next) => {
    if(!req.user) {
        req.flash('error', 'sorry you must be logged in to donate a Movie')
        res.redirect('/login');
    } else{ 
        Celebrity.find()
        .then((allTheCelebritys)=>{
            res.render('Movie-views/new-Movie', {allTheCelebritys})
        })
        .catch((err)=>{
            next(err);
        })
    }
  });

router.post('/create', (req, res, next)=>{
// instead of doing title: req.body.title and decription: req.body.description
// we just take the entire req.body and make a Movie out of it
    const newMovie = req.body;
    newMovie.donor = req.user._id;
    // since req.user is available in every route, its very easy to attach the current users id to any new thing youre creating or editing
    Movie.create(newMovie)
    .then(()=>{
        res.redirect('/Movies');
    })
    .catch((err)=>{
        next(err)
    })
})


router.get('/:theIdThing/edit', (req, res, next)=>{
    Movie.findById(req.params.theIdThing)
    .then((theMovie)=>{

        Celebrity.find()
        .then((allTheCelebritys)=>{

           allTheCelebritys.forEach((Celebrity)=>{
                if(Celebrity._id.equals(theMovie.Celebrity)){
                    Celebrity.yes = true;
                }
            })
         
           console.log(allTheCelebritys)
       
            res.render('Movie-views/edit', {theMovie: theMovie, allTheCelebritys: allTheCelebritys})
        
        
        })
        .catch((err)=>{
            next(err);
        })
    })
    .catch((err)=>{
        next(err);
    })
});


router.post('/:id/update', (req, res, next)=>{

    //req.body is an object with the exact perfect structure of a Movie
    // this is a coicidence becase we gave our inputs name= the same keys that our Movie model has

    Movie.findByIdAndUpdate(req.params.id, req.body)
    .then(()=>{
        res.redirect('/Movies/'+req.params.id);
    })
    .catch((err)=>{
        next(err)
    })
})

router.get('/:id', (req, res, next)=>{
    Movie.findById(req.params.id).populate('Celebrity').populate('donor')
    .then((theMovie)=>{
        res.render('Movie-views/details', theMovie)
        // here we pass in theMovie which is an object, and has keys like
        // title description and Celebrity
        //therefore the variables we will have available in this view are
        // title, description, Celebrity, etc. we will not have a variable called theMovie b/c it is not a key inside theMovie (bc that wouldnt make sense)
    })
    .catch((err)=>{
        next(err);
    })
})


router.post('/:id/delete', (req, res, next)=>{
    Movie.findByIdAndRemove(req.params.id)
    .then(()=>{
        res.redirect('/Movies')
    })
    .catch((err)=>{
        next(err);
    })
})



module.exports = router;
