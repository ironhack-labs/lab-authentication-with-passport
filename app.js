require('dotenv').config()

// Database
require('./configs/mongoose.config')

// Debugger
require('./configs/debugger.config')

// App
const express = require('express')
const app = express()

// Configs
require('./configs/preformatter.config')(app)
require('./configs/middleware.config')(app)
require('./configs/views.configs')(app)
require('./configs/locals.config')(app)
require('./configs/passport.config')(app)   //traer configuración de passport que esta en passport.config.js
// Routes index
require('./routes')(app)

module.exports = app
