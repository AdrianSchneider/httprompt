'use strict';

var HttpResponse  = require('./response');

/**
 * Responsible for making HTTP requests and managing client state
 *
 * @param {Session} session
 * @param {Object}  options
 * @param {Object}  request library
 */
module.exports = function HttpClient(session, options, request) {
  if(!options) options = { json: true };
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
      session.buildUrl(url),
      session.buildOptions(query),
      handleResponse(done)
    );
  };

  /**
   * Sends a PUT request
   */
  this.put = function(url, data, done) {
    request.put(
      session.buildUrl(url),
      session.buildOptions({}, data),
      handleResponse(done)
    );
  };

  /**
   * Sends a POST request
   */
  this.post = function(url, data, done) {
    request.post(
      session.buildUrl(url),
      session.buildOptions({}, data),
      handleResponse(done)
    );
  };

  /**
   * Sends a DELETE request
   */
  this.del = function(url, done) {
    request.del(
      session.buildUrl(url),
      session.buildOptions(),
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
      return done(null, new HttpResponse(res, body));
    };
  };

};
