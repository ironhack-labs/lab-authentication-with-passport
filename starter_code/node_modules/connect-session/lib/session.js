"use strict";
/*!
 * Connect - session
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Session = require('./session/session')
  , debug = require('debug')('connect:session')
  , MemoryStore = require('./session/memory')
  , Store = require('./session/store')
  , utils = require('./utils');

// environment

var env = process.env.NODE_ENV;

/**
 * Expose the middleware.
 */

exports = module.exports = session;

/**
 * Expose constructors.
 */

exports.Store = Store;
exports.Session = Session;
exports.MemoryStore = MemoryStore;

/**
 * Warning message for `MemoryStore` usage in production.
 */

var warning = 'Warning: connection.session() MemoryStore is not\n'
  + 'designed for a production environment, as it will leak\n'
  + 'memory, and will not scale past a single process.';


function session(loaders, options){
  var options = options || {}
    , store = options.store || new MemoryStore
    , generateOnMissingSID = typeof options.generateOnMissingSID === 'undefined' ? 
        true : 
        options.generateOnMissingSID
    , storeReady = true;

  // notify user that this store is not
  // meant for a production environment
  if ('production' == env && store instanceof MemoryStore) {
    console.warn(warning);
  }

  // generates the new session
  store.generate = function(req){
    req.sessionID = utils.uid(24);
    req.session = new Session(req, { maxAge: options.maxAge });
  };

  store.on('disconnect', function(){ storeReady = false; });
  store.on('connect', function(){ storeReady = true; });

  return function session(req, res, next) {
    // self-awareness
    if (req.session) return next();

    // Handle connection as if there is no session if
    // the store has temporarily disconnected etc
    if (!storeReady) return debug('store is disconnected'), next();

    // expose store
    req.sessionStore = store;

    // proxy end() to commit the session
    var end = res.end;
    res.end = function(data, encoding){
      res.end = end;
      if (!req.session) return res.end(data, encoding);
      debug('saving');
      req.session.resetMaxAge();
      req.session.save(function(){
        debug('saved');
        res.end(data, encoding);
      });
    };

    var generate = function() {
      store.generate(req);
    };

    // get the sessionID from the request
    for(var idx in loaders) {
      req.sessionID = loaders[idx](req);
      if(req.sessionID) break;
    }

    // generate a session if the browser doesn't send a sessionID
    if (!req.sessionID) {
      if(generateOnMissingSID) {
        debug('no SID sent, generating session');
        generate(req);
      }
      next();
      return;
    } 

    // generate the session object
    var pause = utils.pause(req);
    debug('fetching %s', req.sessionID);
    store.get(req.sessionID, function(err, sess){
      // proxy to resume() events
      var _next = next;
      next = function(err){
        _next(err);
        pause.resume();
      };

      // error handling
      if (err) {
        debug('error');
        if ('ENOENT' == err.code) {
          generate(req);
          next();
        } else {
          next(err);
        }
      // no session
      } else if (!sess) {
        debug('no session found');
        generate(req);
        next();
      // populate req.session
      } else {
        debug('session found');
        store.createSession(req, sess);
        next();
      }
    });
  };
}


