module.exports = app => {

    // Base URLS
    app.use('/', require('./base.routes'))
    app.use('/auth', require('./auth.routes'))
}