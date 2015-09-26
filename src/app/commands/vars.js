'use strict';

var Command = require('./command');

/**
 * Session-scoped variable management
 *
 * @param {Session} session
 */
module.exports = function(session) {
  var main = function() {
    return [
      new Command('vars set <key> <value>', set),
      new Command('vars unset <key>', unset),
      new Command('vars.<key>', get, null, 'helper'),

      // TODO find better place
      new Command('input.<key>', getInput, null, 'helper')
    ];
  };

  var set = function(request) {
    session.set(request.get('key'), request.get('value'));
  };

  var unset = function(request, get) {
    session.set(request.get('key'), undefined);
  };

  var get = function(request) {
    return session.get(request.get('key'));
  };

  var getInput = function(request) {
    var parent = request.getParentRequest();
    if(!parent) throw new Error('No parent request containing input');
    return parent.get(request.get('key'));
  };

  return main();
};
