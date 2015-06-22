'use strict';

module.exports = function HelpCommand() {

  this.match = function(line) {
    return line === 'help';
  };

  this.process = function(line, done) {
    done(null, 'Here is some advice');
  };

};
