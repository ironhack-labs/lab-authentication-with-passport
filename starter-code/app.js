const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
//mongoose configuration
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/passport-local");

const passport = require("passport");

// const flash = require("connect-flash");

//enable sessions here
const session = require("express-session");
//guardar las cookies de session en mongo
const MongoStore = require("connect-mongo")(session);


require('./configs/db-config'); 
require('./configs/passport.config').setup(passport); 


const index = require('./routes/index');
const users = require('./routes/users');
const passportRouter = require("./routes/passportRouter");

const app = express();


// view engine setup
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//initialize passport and session here
app.use(session({
  //Para saber que la cookie es nuestra y saber si ha sido modifica por un ajente externo
  secret: 'Super Secret',
  //Se guarda automaticamente
  resave: false,
  saveUninitialized: true,
  cookie: {
    //secure = true: la cookie se trasmite solo si esta bajo https
    secure: false,
    //httpOnly= true no se puede modificar la cookie en el chrome. Siempre a true
    httpOnly: true,
    //La duracion de la cookie
    maxAge: 60 * 60 * 24 * 1000
  },
  //Para que se guarde en moongo automaticamente
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60
  })
}));

//SIEMPRE DEBAJO DE LA DE SESSION y antes de las rutas
app.use(passport.initialize());
app.use(passport.session());


// require in the routers
app.use('/', index);
app.use('/', users);
app.use('/', passportRouter);


//passport code here

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;