'use strict';

var HttpResponse  = require('./response');

/**
 * Responsible for making HTTP requests and managing client state
 *
 * @param {ServerProfile} profile
 * @param {Object} options
 * @param {Object} request library
 */
module.exports = function HttpClient(profiles, options, request) {
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
      profiles.getActive().buildUrl(url),
      profiles.getActive().buildOptions(query),
      handleResponse(done)
    );
  };

  /**
   * Sends a PUT request
   */
  this.put = function(url, data, done) {
    request.put(
      profiles.getActive().buildUrl(url),
      profiles.getActive().buildOptions({}, data),
      handleResponse(done)
    );
  };

  /**
   * Sends a POST request
   */
  this.post = function(url, data, done) {
    request.post(
      profiles.getActive().buildUrl(url),
      profiles.getActive().buildOptions({}, data),
      handleResponse(done)
    );
  };

  /**
   * Sends a DELETE request
   */
  this.del = function(url, done) {
    request.del(
      profiles.getActive().buildUrl(url),
      profiles.getActive().buildOptions(),
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

  this.setNextHeader = function(header, value) {
    profiles.getActive().setNextHeader(header, value);
  };

  this.setHeader = function(header, value) {
    profiles.getActive().setHeader(header, value);
  };

  this.unsetHeader = function(header) {
    profiles.getActive().unsetHeader(header);
  };

};
