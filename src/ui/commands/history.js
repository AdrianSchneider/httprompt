'use strict';

module.exports = function HistoryCommands(client, external) {

  this.match = function(line) {
    return line === 'open';
  };

  this.process = function(line, done) {

  };

  this.getHelp = function() {

  };

};
