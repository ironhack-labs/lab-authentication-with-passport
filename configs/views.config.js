const express = require('express');
const path = require('path');

module.exports = (app) => {
    app.set('views', path.join(__dirname, '..', 'views'));
    app.set('view engine', 'hbs');
    app.use(express.static(path.join(__dirname, '..', 'public')));
    //app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
}