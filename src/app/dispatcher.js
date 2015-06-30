'use strict';

var _        = require('underscore');
var async    = require('async');
var expander = require('./utils/expander');

/**
 * Takes a user request and converts it into a response
 * using the many command providers
 *
 * @param {Session} session
 * @param {Array}   commands
 */
module.exports = function Dispatcher(session, commands) {
  var dispatcher = this;

  commands.forEach(function(command) {
    command.setDispatcher(this);
  }.bind(this));

  /**
   * Dispatches commands in the form of free text lines, and
   * delegates work to matched commands
   *
   * @param {Request} request
   * @param {Function} done - err,matched,result
   */
  this.dispatch = function(request, done) {
    preprocess(request);

    var command = getMatchingCommand(request);
    if (!command) return done(null, false);

    return command.process(request, function(err, result) {
      if (err) return done(err);
      return done(null, true, result);
    });
  };

  var getMatchingCommand = function(request) {
    var command = _.first(commands.filter(function(command) { return command.match(request); }));
    if (request) request.setCommand(command);
    return command;
  };

  var preprocess = function(request) {
    return request;
  };

  this.getCommands = function() {
    return commands;
  };

};
