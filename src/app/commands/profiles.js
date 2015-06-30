'use strict';

var Command = require('./command');

/**
 * Profile management commands
 *
 * @param {Object} config
 */
module.exports = function ConfigCommands(config, client) {
  var main = function() {
    return [
      new Command('profiles list',          Command.equals('profiles list'), listProfiles), 
      new Command('profiles switch <name>', Command.startsWith('profiles switch'), switchProfile)
    ];
  };

  var listProfiles = function(request, done) {
    done(null, config.getProfiles().getList());
  };

  var switchProfile = function(request, done) {
    try {
      config.getProfiles().switchTo(request.get('name'));
      done();
    } catch (e) {
      return done(e);
    }
  };

  return main();
};
