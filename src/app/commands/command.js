'use strict';

function Command(help, matcher, processor) {

  if (!processor) {
    matcher = this.matchFrom(help);
    processor = matcher;
  }

  this.match = matcher;
  this.process = processor;


  this.setSession = function(session) {
    this.session = session;
  };

  this.setDispatcher = function(dispatcher) {
    this.dispatcher = dispatcher;
  };

}

Command.prototype.matchFrom = function(text) {
  return function(request) {
    var pattern = new RegExp('^' + text.replace(/<([-a-z0-9]*)>/gi, function() { return '([^ ]+)'; }) + '$');
  };
};

Command.prototype.startsWith = function(str) {
  return function(response) {
    return response.getLine().indexOf(str) === 0;
  };
};

Command.equals = function(str) {
  return function(response) {
    return response.getLine() === str;
  };
};

Command.startsWith = function(str) {
  return function(response) {
    return response.getLine().indexOf(str) === 0;
  };
};

module.exports = Command;
