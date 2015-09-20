'use strict';

var _                   = require('underscore');
var async               = require('async');
var requestPreprocessor = require('./request.preprocessor');

/**
 * Takes a user request and converts it into a response
 * using the many command providers
 *
 * @param {Session} session
 * @param {Array}   baseCommands
 */
module.exports = function Dispatcher(session, baseCommands, config) {
  var dispatcher = this;
  var commands = [];

  /**
   * Dispatches commands in the form of free text lines, and
   * delegates work to matched commands
   *
   * @param {Request} request
   * @param {Function} done - err,matched,result
   */
  this.dispatch = function(request, done) {
    requestPreprocessor(request, this, function(err, req) {
      if(err) return done(err);

      var command = getMatchingCommand(req);
      if (!command) return done(null, false);

      if (command.isSync()) {
        return handleSyncCommand(command, req, handleResponse(req, done));
      }

      return command.process(req, handleResponse(req, done));
    });
  };

  /**
   * Wraps a sync command processor in try/catch and calls callback with response/error
   *
   * @param {Command} command
   * @param {Request} request
   * @param {Function} done
   */
  var handleSyncCommand = function(command, request, done) {
    try {
      var response = command.process(request);
      done(null, response);
    } catch (e) {
      done(e);
    }
  };

  /**
   * Response handler after command processor finishes
   *
   * @param {Request} request
   * @param {Function} done
   * @return {Function}
   */
  var handleResponse = function(request, done) {
    return function(err, response) {
      if (err) return done(err);
      session.log(request, response);
      return done(null, true, response);
    };
  };

  /**
   * Finds the first command that matches the request
   *
   * @param {Request} request
   * @return {Command}
   */
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
    if (session.getProfile()) {
      commands = commands.concat(session.getProfile().getCommands(dispatcher));
    }

    commands.forEach(function(command) {
      command.setDispatcher(dispatcher);
    });
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

  session.on('profiles.switch', refreshCommands);
  refreshCommands();

};
