'use strict';

var _ = require('underscore');

/**
 * Represents a user request
 *
 * @param {String} line
 * @param {Object|null} params
 * @param {Request|null} parentRequest
 */
module.exports = function Request(line, params, parentRequest) {
  if (!params) params = {};
  var command;
  var regex = /\$\(([^)]+)\)/;

  /**
   * Returns original line of user input
   * @return {String}
   */
  this.getLine = function() {
    return line;
  };

  /**
   * Sets the command that is handling the request
   *
   * @param {Command} setCommand
   * @throws {Error} when already set
   */
  this.setCommand = function(setCommand) {
    if (command) throw new Error('Cannot reset command');
    command = setCommand;
  };

  /**
   * Gets the command that is handling the request
   *
   * @return {Command}
   * @throws {Error} when not set
   */
  this.getCommand = function() {
    if (!command) throw new Error('No command is set yet');
    return command;
  };

  /**
   * Sets an arbitrary request value
   *
   * @param {String} key
   * @param {*} value
   */
  this.set = function(key, value) {
    params[key] = value;
  };

  /**
   * Gets an arbitrary request value
   *
   * @param {String} key
   * @return {*}
   */
  this.get = function(key) {
    if (typeof params[key] === 'undefined') throw new Error('"' + key + '" is not set');
    return params[key];
  };

  /**
   * Checks to see if this request has any unevaluated sub-expressions
   *
   * @return {Boolean}
   */
  this.requiresEvaluation = function() {
    return regex.test(line);
  };

  /**
   * Evaluate this request for sub expressions
   *
   * @param {Function} f - called with val,done
   * @param {Function} done - called with err,newline
   */
  this.evaluate = function(f, done) {
    var result = line.match(regex);
    if(!result) throw new Error('Could not do it ' + line);

    f(result[1], function(err, bool, result) {
      if(err) return done(err);
      return done(null, new Request(line.replace(regex, result), params));
    });
  };

  this.clone = function() {
    return new this(line, _.clone(params));
  };

  this.getParentRequest = function() {
    return parentRequest;
  };

};
