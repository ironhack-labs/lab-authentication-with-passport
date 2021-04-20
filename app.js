require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

// DB Mongo
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
require('./configs/middleware.config')(app);

// Express View engine setup
require('./configs/views.config')(app);
require('./configs/session.config')(app);
require('./configs/passport.config')(app);


// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// Routes middleware goes here
const index = require('./routes/index.routes');
const authRoutes = require('./routes/auth.routes');
const privateRouter = require('./routes/private.routes');
app.use('/', index);
app.use('/', authRoutes);
app.use('/private', privateRouter);

module.exports = app;
