require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const session      = require('express-session');
const flash        = require('connect-flash'); // for flashing
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

mongoose
  .connect('mongodb://localhost/lab-authentication-with-passport', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

////////var sessionStore = new session.MemoryStore;
// Middleware Setup

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

// register session() BEFORE doing it in passportRouter.js

app.use(session({secret:'keyboard cat',resave:true,saveUninitialized:true}));
// flash AFTER session!
app.use(flash());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';


// Routes middleware goes here
const index = require('./routes/index');
app.use('/', index);
const passportRouter = require("./routes/passportRouter");
app.use('/passport', passportRouter);

// check flash!!
app.get('/flash',(req, res,next)=>{
  // Set a flash message by passing the key, followed by the value, to req.flash().
  req.flash('info', 'Flash is back!');
  console.log("Flash called: "+req.flash('info'));
  res.redirect('/');
});

// fall-through routes
app.use('*',(req,res,next)=>{
  res.render('not-found');
});

// custom error handler on all routes
app.use((err,req,res,next)=>{
  res.render('error',err);
});

// the game's afoot
app.listen(process.env.PORT,()=>{console.log("Express server running on port "+process.env.PORT+".")});

module.exports = app;
