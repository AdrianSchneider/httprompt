'use strict';

module.exports = function Dispatcher(commands) {
  var dispatcher = this;

  commands.filter(function(command) {
    return command.setDispatcher;
  }).forEach(function(command) {
    command.setDispatcher(dispatcher);
  });

  /**
   * Dispatches commands in the form of free text lines, and
   * delegates work to matched commands
   *
   * @param {String} line
   * @param {Function} done - err,matched,result
   */
  this.dispatch = function(line, done) {
    var matched = commands.filter(function(provider) { return provider.match(line); })[0];
    if (!matched) return done(null, false);
    return matched.process(line, function(err, result) {
      if (err) return done(err);
      return done(null, true, result);
    });
  };

  this.getCommands = function() {
    return commands;
  };

};
