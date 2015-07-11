'use strict';

var Command = require('./command');

module.exports = function() {
  return [
    new Command('help', function(request, done) {
      done(null, this.dispatcher.getCommands()
        .map(function(command) { return command.getHelp(); })
        .sort());
    })
  ];
};
