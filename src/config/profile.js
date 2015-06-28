'use strict';

var _       = require('underscore');
var Session = require('../session/session');

/**
 * Represents a configuration profile for a server
 *
 * @param {String} baseUrl
 */
function ConfigProfile(baseUrl, actions) {
  if (!actions) actions = {};
  var session;

  /**
   * Called whenever switching to this profile
   * Ensures a session is ready
   */
  this.activate = function() {
    if (!session) session = new Session(this);
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

ConfigProfile.fromConfig = function(config) {
  return new ConfigProfile(config.baseUrl, config.actions || {});
};

module.exports = ConfigProfile;
