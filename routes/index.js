module.exports = app => {

    //Base URLS
    app.use('/', require('./base.routes'))
    app.use('/', require('./auth.routes'))
}