'use strict';

var _       = require('underscore');
var Command = require('./command');

/**
 * HTTP Header Command Handlers
 *
 * @param {Session} session
 */
module.exports = function HttpHeaderCommands(session) {
  var main = function() {
    return [
      new Command('header set <name> <value>',   setHeader),
      new Command('header stick <name> <value>', stickHeader),
      new Command('header unset <name>',         unsetHeader)
    ];
  };

  var setHeader = function(request) {
    session.setNextHeader(request.get('name'), request.get('value'));
  };

  var stickHeader = function(request) {
    session.setHeader(request.get('name'), request.get('value'));
  };

  var unsetHeader = function(request) {
    session.unsetHeader(request.get('name'));
  };

  return main();
};
