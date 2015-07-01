'use strict';

var _         = require('underscore');
var async     = require('async');
var Command   = require('../app/commands/command');
var Request   = require('../app/request');
var Namespace = require('../session/namespace');

/**
 * Represents a configuration profile for a server
 *
 * @param {String} baseUrl
 */
function ConfigProfile(baseUrl, actions) {
  if (!actions) actions = {};
  var session;
  var active = false;

  /**
   * Called whenever switching to this profile
   * Ensures a session is ready
   */
  this.activate = function(userSession) {
    active = true;
    if (!session) {
      session = new Namespace(this);
      userSession.on('entry', function(request, response) {
        if (active) {
          session.log(request, response);
        }
      });
    }
  };

  /**
   * Called when the profile is deactivated
   * Disables logging to session when profile is inactive
   */
  this.deactivate = function(userSession) {
    active = false;
  };

  this.getSession = function() {
    return session;
  };

  /**
   * Generates a URL, combining the base URL with the additional path
   *
   * @param {String} path
   * @return {String}
   */
  this.buildUrl = function(path) {
    return baseUrl + path;
  };

  /**
   * Generates the options to use for the request
   *
   * @param {Object} query
   * @param {Object} data
   * @param {Object} headers
   * @return {Object}
   */
  this.buildOptions = function(query, data, headers) {
    return {
      json    : data    || {},
      query   : query   || {},
      headers : session.prepareHeaders(headers)
    };
  };

  /**
   * Gets custom commands from this profile
   * Each command just runs all lines against the dispatcher
   *
   * @param {Dispatcher} dispatcher
   * @return {Array<Command>}
   */
  this.getCommands = function(dispatcher) {
    return Object.keys(actions).map(function(actionString) {
      return new Command(
        actionString,
        function(request, done) {
          async.eachSeries(actions[actionString], function(line, next) {
            dispatcher.dispatch(new Request(line), function(err, result, response) {
              if (err) return next(err);
              if (!result) return next(new Error('"' + line + ' does not match any commands'));
              return next();
            });
          }, function(err) {
            if (err) return done(err);
            return done();
          });
        }
      );
    });
  };

}

/**
 * Instantiates a new ConfigProfile from config
 *
 * @param {Object} config
 * @return {ConfigProfile}
 */
ConfigProfile.fromConfig = function(config) {
  return new ConfigProfile(config.baseUrl, config.actions || {});
};

module.exports = ConfigProfile;
