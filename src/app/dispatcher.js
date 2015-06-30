'use strict';

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
   * @param {String} line
   * @param {Function} done - err,matched,result
   */
  this.dispatch = function(line, done) {
    line = preprocessLine(line);
    var matched = commands.filter(function(provider) { return provider.match(line); })[0];
    if (!matched) return done(null, false);
    return matched.process(line, function(err, result) {
      if (err) return done(err);

      //session.emit('entry', line, result);
      return done(null, true, result);
    });
  };

  var preprocessLine = function(line) {
    return line;
  };

  this.getCommands = function() {
    return commands;
  };

};
