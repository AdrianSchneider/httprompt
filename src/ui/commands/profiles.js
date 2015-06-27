'use strict';

var HttpProfile = require('../profile');

/**
 * Profile management commands
 *
 * @param {Object} config
 */
module.exports = function ConfigCommands(config, client) {
  var keywords = ['profiles list', 'profiles set', 'profiles switch'];

  /**
   * Check if this should handle the line
   *
   * @param {String} line - an input line from the repl
   * @return {Boolean}
   */
  this.match = function(line) {
    return keywords.filter(function(keyword) {
      return line.indexOf(keyword) === 0;
    }).length >= 1;
  };

  /**
   * Processes the line after matching
   *
   * @param {String} line - an input line from the repl
   * @param {Functoin} done - called when complete
   *
   */
  this.process = function(line, done) {
    var items = line.toLowerCase().split(' ');
    if (items[1] === 'list') return handleList(done);
    done();
  };

  var handleList = function(done) {
    done(null, Object.keys(config.get('profiles') || []));
  };

  var handleSet = function(key, value, done) {

  };

  /**
   * Switches the client to use another profile
   *
   * @param {String} profile
   * @param {Function} done
   */
  var handleSwitch = function(profile, done) {
    client.switchProfile(
      HttpProfile.fromConfig(
        config.get('profiles')[profile]
      )
    );
  };

  /**
   * Returns the help for this module
   *
   * @return {Array}
   */
  this.getHelp = function() {
    return [
      'profiles list'
    ];
  };

};
