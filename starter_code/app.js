require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const passport     = require('passport');
const session      = require('express-session');
const MongoStore   = require('connect-mongo')(session);

function passportSetup (app){
  //add properties and methods to the "req" object in routes
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req,res,next) =>{

      // make "req.user" accessible inside hbs files as "blahUser"
      res.locals.blahUser = req.user;
      // tells middleware to exit
      next();
  })
}

mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/passport-local', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'secret different for every app',
  saveUninitialized: true,
  resave: true,
  //Store session data in MongoDB, otherwise we would be logged out constantly on refresh
  store: new MongoStore({ mongooseConnection: mongoose.connection})
}));

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

passportSetup(app);

const index = require('./routes/index');
const passportRouter = require("./routes/passportRouter");
app.use('/', index);
app.use('/', passportRouter);


module.exports = app;
