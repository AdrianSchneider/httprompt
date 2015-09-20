'use strict';

var _ = require('underscore');

/**
 * Represents a command the user can input to perform an action
 * Helper functions, a subset of functions, are meant to be used
 * in conjunction with other commands to provide data
 *
 * @param {String}   help - help text or declarative command definition
 * @param {Function} matcher - function to return true/false for a given request
 * @param {Function} processor - function to run when command matches, accepting request,done
 * @param {String}   type - type of command (command or helper)
 */
function Command(help, matcher, processor, type) {
  var types = ['helper', 'command', 'user'];
  if(!type) type = 'command';

  if(types.indexOf(type) === -1) {
    throw new Error(type + ' is not a valid command type (must be helper|user|command)');
  }

  if (!processor) {
    processor = matcher;
    matcher = this.matchFrom(help);
  }

  this.match = matcher;
  this.process = processor.bind(this);

  /**
   * Brings the session into scope
   * @param {Session} session
   */
  this.setSession = function(session) {
    this.session = session;
  };

  /**
   * Brings the dispatcher into scope
   * @param {Dispatcher} dispatcher
   */
  this.setDispatcher = function(dispatcher) {
    this.dispatcher = dispatcher;
  };

  /**
   * Gets the dispatcher
   * @param {Dispatcher} dispatcher
   */
  this.getDispatcher = function() {
    return this.dispatcher;
  };

  /**
   * Is this command synchronous (no callback)
   * @return {Boolean}
   */
  this.isSync = function() {
    return this.process.length !== 2;
  };

  /**
   * Is this a helper or should it be used directly?
   * @return {Boolean}
   */
  this.isType = function(wantedType) {
    return type === wantedType;
  };

  /**
   * Gets the help text for this command
   * @return {String}
   */
  this.getHelp = function() {
    return help;
  };

  /**
   * String representation should be the help text
   *
   * @return {String}
   */
  this.toString = function() {
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
    var input = request.getLine();
    var pattern = new RegExp('^' + text.replace(/<([-a-z0-9]*)>/gi, function() { return '([^ ]+)'; }) + '$');
    var result = pattern.test(text);
    if (!result) return false;

    if (!pattern.test(input)) return false;

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

/**
 * Returns a predicate for filtering commands by type
 * @param {String} type
 * @return {Function} accepting command filtering by type
 */
Command.ifType = function(type) {
  return function(command) {
    return command.isType(type);
  };
};

module.exports = Command;
