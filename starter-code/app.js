require('dotenv').config();

// Database
require('./configs/mongoose.configs')

// Debugger
require('./configs/debugger.configs')

// App
const express = require('express')
const app = express()

// Configs
require('./configs/middleware.configs')(app)
require('./configs/preformatter.configs')(app)
require('./configs/views.configs')(app)
require('./configs/locals.configs')(app)
require('./configs/passport.configs')(app)

// Base URLS
app.use('/', require('./routes/index.routes'))
app.use('/', require("./routes/passportRouter.routes"));


module.exports = app