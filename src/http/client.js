'use strict';

var _            = require('underscore');
var HttpResponse = require('./response');

module.exports = function HttpClient(request, profile) {

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
      query ? { query: query } : {},
      handleResponse(done)
    );
  };

  /**
   * Sends a PUT request
   */
  this.put = function(url, data, done) {

  };

  /**
   * Sends a POST request
   */
  this.post = function(url, data, done) {

  };

  /**
   * Sends a DELETE request
   */
  this.del = function(url, done) {

  };

  /**
   * Returns a response handler that converts
   * res,body into a single HttpResponse object
   *
   * @param function done
   * @return function
   */
  var handleResponse = function(done) {
    return function(err, res, body) {
      if(err) return done(err);
      return done(null, new HttpResponse(res, body));
    };
  };

};
