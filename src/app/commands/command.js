'use strict';

var _ = require('underscore');

function Command(help, matcher, processor) {

  if (!processor) {
    processor = matcher;
    matcher = this.matchFrom(help);
  }

  this.match = matcher;
  this.process = processor;

  this.setSession = function(session) {
    this.session = session;
  };

  this.setDispatcher = function(dispatcher) {
    this.dispatcher = dispatcher;
  };

  this.getHelp = function() {
    return help;
  };

}

/**
 * Uses the built in help text for basic pattern matching
 * Variables in the command are attached to the request
 *
 * Example:
 *  set <key> <value>
 *  set myname adrian
 *
 * If the request matches, it will set request.key to myname, and request.value to adrian
 *
 * @param {String} text (from command config)
 * @return {Boolean}
 */
Command.prototype.matchFrom = function(text) {
  var command = this;
  return function(request) {
    var pattern = new RegExp('^' + text.replace(/<([-a-z0-9]*)>/gi, function() { return '([^ ]+)'; }) + '$');
    var result = pattern.test(text);
    if (!result) return false;

    if (/<([-a-z0-9]*)>/gi.test(text)) {
      var keys = text.match(/<([-a-z0-9]*)>/gi).map(function(str) { return str.replace('<', '').replace('>', ''); });    
      var values = request.getLine().match(pattern).slice(1);

      for (var i = 0; i < keys.length; i++) {
        request.set(keys[i], values[i]);
      }
    }

    return true;
  };
};

module.exports = Command;
