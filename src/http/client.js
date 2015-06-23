'use strict';

var HttpResponse = require('./response');

module.exports = function HttpClient(request, profile, maxHistory) {
  var history = [];
  if(!maxHistory) maxHistory = 10;

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
      history.push({ res: res, body: body });
      history = history.slice(-maxHistory);
      return done(null, new HttpResponse(res, body));
    };
  };

};
