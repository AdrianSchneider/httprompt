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

  this.setCommand = function(setCommand) {
    if (command) throw new Error('Cannot reset command');
    command = setCommand;
  };

  this.getCommand = function() {
    if (!command) throw new Error('No command is set yet');
    return command;
  };

  this.set = function(key, value) {
    params[key] = value;
  };

  this.get = function(key) {
    return params[key];
  };

};
