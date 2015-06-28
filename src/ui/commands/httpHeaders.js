'use strict';

var _ = require('underscore');

/**
 * HTTP Header Command Handlers
 *
 * @author Adrian Schneider <adrian@compiledintent.com>
 * @param {HttpClient} client
 */
module.exports = function HttpHeaderCommands(client) {
  var commands = ['header set', 'header stick', 'header unset'];

  /**
   * Matches the above header * commands
   *
   * @param  {String} line
   * @return {Boolean}
   */
  this.match = function(line) {
    return _.find(commands, function(command) {
      return line.indexOf(command) === 0;
    });
  };

  /**
   * Processes a line of input that has been matched
   *
   * @param {String} line   - an input line from the repl
   * @param {Function} done - called when complete
   */
  this.process = function(line, done) {
    var items = line.split(' ');
    var action = items[1];
    var header = items[2];
    var value  = items[3];

    if (action === 'set')   client.setNextHeader(header, value);
    if (action === 'stick') client.setHeader(header, value);
    if (action === 'unset') client.unsetHeader(header, value);

    done();
  };

  /**
   * Returns the help for this module
   *
   * @return {Array}
   */
  this.getHelp = function() {
    return [
      'header set <header> <value>: sets a header for the next request',
      'header stick <header> <value>: sets a header for the session',
      'header unset <header>: unsets a header'
    ];
  };

};
