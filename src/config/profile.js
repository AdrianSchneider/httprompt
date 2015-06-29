'use strict';

var _         = require('underscore');
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
      userSession.on('entry', function(line, response) {
        if (active) {
          session.log(line, response);
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

  this.getActions = function() {
    return actions;
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
