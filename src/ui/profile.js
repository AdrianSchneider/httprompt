'use strict';

/**
 * Represents a configuration profile for a server
 *
 * @param {String} baseUrl
 */
function ServerProfile(baseUrl) {

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
      headers : headers || {}
    };
  };
}

ServerProfile.fromConfig = function(config) {
  return new ServerProfile(config.baseUrl);
};

module.exports = ServerProfile;
