'use strict';

var _       = require('underscore');
var sprintf = require('util').format;
var Command = require('./command');

/**
 * Provides the help command
 *
 * @return {Array<Command>}
 */
module.exports = function(groups) {
  var main = function() {
    return [
      new Command('help', getHelpText)
    ];
  };

  /**
   * Generates the help text
   *
   * @param {Request}
   * @return {String}
   */
  var getHelpText = function(request) {
    var command = this;
    return groups
      .map(function(group) {
        return _.extend(group, { commands: getCommands(command, group.key) });
      })
      .filter(function(group) {
        return group.commands.length;
      })
      .map(function(group) {
        return sprintf('%s:\n\n\t%s', group.text, group.commands.join('\n\t'));
      })
      .reduce(function(out, groupText) {
        return out + groupText + '\n\n';
      }, '');
  };

  /**
   * Get an array of the standard commands
   *
   * @return {Array<Command>}
   */
  var getCommands = function(command, type) {
    return command.dispatcher.getCommands()
      .filter(Command.ifType(type))
      .map(String)
      .sort();
  };

  return main();
};
