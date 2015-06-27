'use strict';

var HttpResponse  = require('./response');
var ConfigProfile = require('../config/profile');

/**
 * Responsible for making HTTP requests and managing client state
 *
 * @param {ServerProfile} profile
 * @param {Object} options
 * @param {Object} request library
 */
module.exports = function HttpClient(profile, options, request) {
  if (!(profile instanceof ConfigProfile)) {
    throw new Error('HttpClient expects an ConfigProfile');
  }

  var history = [];
  if(!options) options = {};
  if(!options.maxHistory) options.maxHistory = 10;
  if(!request) request = require('request');

  /**
   * Sends a GET request
   */
  this.get = function(url, query, done) {
    if (arguments.length == 2) {
      done = query;
      query = {};
    }

    request.get(
      profile.buildUrl(url),
      profile.buildOptions(query),
      handleResponse(done)
    );
  };

  /**
   * Sends a PUT request
   */
  this.put = function(url, data, done) {
    request.put(
      profile.buildUrl(url),
      profile.buildOptions({}, data),
      handleResponse(done)
    );
  };

  /**
   * Sends a POST request
   */
  this.post = function(url, data, done) {
    request.post(
      profile.buildUrl(url),
      profile.buildOptions({}, data),
      handleResponse(done)
    );
  };

  /**
   * Sends a DELETE request
   */
  this.del = function(url, done) {
    request.del(
      profile.buildUrl(url),
      profile.buildOptions(),
      handleResponse(done)
    );
  };

  /**
   * Returns a response handler that converts
   * res,body into a single HttpResponse object
   *
   * @param {Function} done
   * @return {Function}
   */
  var handleResponse = function(done) {
    return function(err, res, body) {
      if(err) return done(err);
      var response = new HttpResponse(res, body);
      history.push(response);
      return done(null, response);
    };
  };

  /**
   * Returns the history
   *
   * @return Array
   */
  this.getHistory = function() {
    return history;
  };

  /**
   * Sets the active profile
   *
   * @param {ConfigProfile} newProfile
   */
  this.switchProfile = function(newProfile) {
    if (!(newProfile instanceof ConfigProfile)) {
      throw new TypeError('switchProfiles expects an ConfigProfile');
    }

    console.error('Switching to another profile');
    profile = newProfile;
  };

};
