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
      new Command('header set <name> <value>',   Command.startsWith('header set'),   process('set')),
      new Command('header stick <name> <value>', Command.startsWith('header stick'), process('stick')),
      new Command('header unset <name>',         Command.startsWith('header unset'), process('unset'))
    ];
  };

  var process = function(command) {
    return function(request, done) {
      var items = request.getLine().split(' ');
      var action = items[1];
      var header = items[2];
      var value  = items[3];

      if (action === 'set')   session.setNextHeader(header, value);
      if (action === 'stick') session.setHeader(header, value);
      if (action === 'unset') session.unsetHeader(header, value);

      done();
    };
  };

  return main();
};
