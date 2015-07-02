'use strict';

/**
 * Represents a user request
 *
 * @param {String} line
 */
module.exports = function Request(line, params) {
  if (!params) params = {};
  var command;

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

};
