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
function ConfigProfile(name, baseUrl, actions, vars, startupTasks) {
  if (!vars) vars = {};
  if (!actions) actions = {};
  if (!startupTasks) startupTasks = [];

  var session;
  var active = false;

  /**
   * Gets the name of this profile
   *
   * @return {String}
   */
  this.getName = function() {
    return name;
  };

  /**
   * Is this profile currently active
   *
   * @return {Boolean}
   */
  this.isActive = function() {
    return active;
  };

  /**
   * Called whenever switching to this profile
   * Ensures a session is ready
   *
   * @param {Session} userSession
   * @param {Dispatcher} dispatcher
   * @param {Function} done
   */
  this.activate = function(userSession, dispatcher, done) {
    active = true;
    if (!session) {
      session = new Namespace(this);
      userSession.on('entry', function(request, response) {
        if (active) {
          session.log(request, response);
        }
      });

      return async.eachSeries(startupTasks, function(line, next) {
        dispatcher.dispatch(new Request(line), next);
      }, done);
    }

    done();
  };

  /**
   * Called when the profile is deactivated
   * Disables logging to session when profile is inactive
   *
   * @param {Session} userSession
   */
  this.deactivate = function(userSession) {
    active = false;
  };

  /**
   * Gets the active session namespace for this profile
   *
   * @return {SessionNamespace}
   */
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
            dispatcher.dispatch(new Request(line), request, function(err, result, response) {
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

  /**
   * Gets an arbitrary profile config variable
   *
   * @param {String} key
   * @return {*}
   */
  this.getVariable = function(key) {
    return vars[key];
  };

  /**
   * Sets a specific variable
   *
   * @param {String} key
   * @param {*} value
   */
  this.setVariable = function(key, value) {
    vars[key] = value;
  };

  /**
   * Gets all of the variables
   *
   * @return {Object}
   */
  this.getVariables = function() {
    return vars;
  };

  /**
   * Serializes the profile for storage
   *
   * @return {Object}
   */
  this.serialize = function() {
    return {
      baseUrl      : baseUrl,
      actions      : actions,
      vars         : vars,
      startupTasks : startupTasks
    };
  };

}

/**
 * Instantiates a new ConfigProfile from config
 *
 * @param {Object} config
 * @return {ConfigProfile}
 */
ConfigProfile.fromConfig = function(name, config) {
  return new ConfigProfile(
    name,
    config.baseUrl,
    config.actions || {},
    config.vars    || {},
    config.startup || []
  );
};

module.exports = ConfigProfile;
