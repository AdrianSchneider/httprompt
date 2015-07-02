'use strict';

var Command = require('./command');

/**
 * Config commands
 *
 * @param {Object} config
 */
module.exports = function(config) {
  var main = function() {
    return [
      new Command('config list',              getList),
      new Command('config get <key>',         getConfig),
      new Command('config set <key> <value>', setConfig)
    ];
  };

  var getList = function(request, done) {
    done(null, config.getGlobals());
  };

  var getConfig = function(request, done) {
    var key = request.get('key');
    if (!config.has(key)) {
      return done(new Error('Config key "' + key + '" does not exist'));
    }
    return done(null, config.get(key));
  };

  var setConfig = function(request, done) {
    var key = request.get('key');
    var value = request.get('value');

    if (!config.has(key)) {
      return done(new Error('Config key "' + key + '" does not exist'));
    }

    if (value === 'true')  value = true;
    if (value === 'false') value = false;
    if (/([0-9]+)/.test(value)) value = parseInt(value, 10);

    config.set(key, value);
    return done(null, 'ok');
  };

  return main();

};
