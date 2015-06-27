'use strict';

/**
 * Profile management commands
 *
 * @param {Object} config
 */
module.exports = function ConfigCommands(config, client) {
  var keywords = ['profiles list', 'profiles switch'];

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
    if (items[1] === 'switch') return handleSwitch(items[2], done);
    done();
  };

  /**
   * Lists the profile names
   *
   * @param {Function} done
   */
  var handleList = function(done) {
    done(null, config.getProfiles().getList());
  };

  /**
   * Switches the client to use another profile
   *
   * @param {String} profile
   * @param {Function} done
   */
  var handleSwitch = function(profile, done) {
    client.switchProfile(config.getProfiles().get(profile));
    done();
  };

  /**
   * Returns the help for this module
   *
   * @return {Array}
   */
  this.getHelp = function() {
    return [
      'profiles list',
      'profiles switch <profileName>'
    ];
  };

};
