const bodyParser = require('body-parser');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

module.exports = (app) => {
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
};