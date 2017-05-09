var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
const layouts = require('express-ejs-layouts');
var index = require('./routes/index');
var users = require('./routes/users');
const passportRouter = require("./routes/passportRouter");
//mongoose configuration
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/passport-local");
//require the user model
const User = require("./models/user");
const session = require("express-session");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");
app.locals.title = 'Express - Generated with IronGenerator';




//enable sessions here
app.use(session({
    secret: 'practing loging in',
    resave: true,
    saveUninitialized: true
}));



//initialize passport and session here
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    if (req.user) {
        res.locals.user = req.user;
    }
    next();
});
passport.serializeUser((user, cb) => {
    //only when you log in
    cb(null, user._id);
});

//where to get the rest of the users given (what in the box)
passport.deserializeUser((userId, cb) => {
    //callled every time AFTER LOG IN
    //querying the database with the id
    User.findById(userId, (err, theUser) => {
        if (err) {
            cb(err);
            return;
        }
        // we are sending user info to passport
        cb(null, theUser);
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(layouts);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// require in the routers
app.use('/', index);
app.use('/', users);
app.use('/', passportRouter);





//passport code here
passport.use(new LocalStrategy({
        usernameField: 'usernameValue',
        passwordField: 'passwordValue'
    },
    (userName, passWord, next) => {
        User.findOne({
            username: userName
        }, (err, foundOne) => {
            if (err) {
                next(err);
                return;
            }
            if (!foundOne) {
                next(null, false);
                return;
            }
            if (bcrypt.compareSync(passWord, foundOne.password)) {
                next(null, false);
            }
            next(null, foundOne);
        });

    }));








// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
