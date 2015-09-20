'use strict';

var async   = require('async');
var Request = require('./request');

/**
 * Processes a request for embedded requests
 *
 * "do x with $(some_other_command)"
 *
 * @param {Request} request
 * @param {Dispatcher} dispatcher
 * @param {Function} done - errresult
 */
module.exports = function RequestPreprocessor(request, dispatcher, done) {
  var req = request;

  async.whilst(
    function() {
      return req.requiresEvaluation();
    },
    function(next) {
      req.evaluate(
        function(line, doneLine) {
          dispatcher.dispatch(new Request(line, null, request.getParentRequest()), doneLine);
        },
        function(err, newRequest) {
          if(err) return next(err);
          req = newRequest;
          return next();
        }
      );
    },
    function(err) {
      if(err) return done(err);
      return done(null, req);
    }
  );
};
