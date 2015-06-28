'use strict';

var _ = require('underscore');

/**
 * Represents a configuration profile for a server
 *
 * @param {String} baseUrl
 */
function ConfigProfile(baseUrl, actions) {
  if (!actions) actions = {};

  var session = {
    headers: {} ,
    nextHeaders: {}
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
      headers : prepareHeaders(headers || {})
    };
  };

  /**
   * Merges all of the headers into what hits the client
   *
   * @param {Object} headers
   * @return {Object} merged headers
   */
  var prepareHeaders = function(headers) {
    var out =  _.extend(
      {},
      headers,
      session.nextHeaders,
      session.headers
    );

    session.nextHeaders = {};
    return out;
  };

  this.getActions = function() {
    return actions;
  };

  this.setHeader = function(header, value) {
    session.headers[header] = value;
  };

  this.setNextHeader = function(header, value) {
    session.nextHeaders[header] = value;
  };

  this.unsetHeader = function(header) {
    delete session.headers[header];
    delete session.nextHeaders[header];
  };
}

ConfigProfile.fromConfig = function(config) {
  return new ConfigProfile(config.baseUrl, config.actions || {});
};

module.exports = ConfigProfile;
