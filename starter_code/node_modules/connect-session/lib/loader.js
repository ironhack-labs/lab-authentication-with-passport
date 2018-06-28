"use strict";

/*!
This will try to find session id inside request headers
 */
module.exports.header = function(options) {
    options = options || {};
    var headerName = (options.header || 'X-User-Session').toLowerCase();

    return function(req) {
        return req.headers[headerName];
    };
};

/*!
This function will try to find in following places:
* params
* query
* body
 */
module.exports.param = function(options) {
    options = options || {};
    var paramName = options.param || 'sid';

    return function(req) {
        return req.param(paramName);
    };
};

/*!
Will try to find session id in query param, for this query middleware is required
 */
module.exports.query = function(options) {
    options = options || {};
    var queryParamName = options.queryParam || 'sid';

    return function(req) {
        return req.query[queryParamName];
    };
};