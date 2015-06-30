'use strict';

var _        = require('underscore');
var async    = require('async');
var expander = require('../utils/expander');

/**
 * Takes a user request and converts it into a response
 * using the many command providers
 *
 * @param {Session} session
 * @param {Array}   baseCommands
 */
module.exports = function Dispatcher(session, baseCommands) {
  var dispatcher = this;
  var commands = [].concat(baseCommands);

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

  /**
   * Refreshes the commands based on the session
   */
  var refreshCommands = function() {
    commands = [].concat(baseCommands);

    commands.forEach(function(command) {
      command.setDispatcher(dispatcher);
    });
  };

  var preprocess = function(request) {
    return request;
  };

  /**
   * Returns the built-in commands
   * @return {Array<Command>}
   */
  this.getBaseCommands = function() {
    return baseCommands;
  };

  /**
   * Returns all of the commands (built-in and custom)
   * @return {Array<Command>}
   */
  this.getCommands = function() {
    return commands;
  };

};
