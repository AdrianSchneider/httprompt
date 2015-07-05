'use strict';

var Command = require('./command');

/**
 * Profile management commands
 *
 * @param {Object} config
 */
module.exports = function(config, session) {
  var main = function() {
    return [
      new Command('profiles list',          listProfiles),
      new Command('profiles switch <name>', switchProfile)
    ];
  };

  var listProfiles = function(request, done) {
    done(null, config.getProfiles().getList());
  };

  var switchProfile = function(request, done) {
    try {
      session.switchProfile(request.get('name'), this.getDispatcher(), done);
    } catch (e) {
      return done(e);
    }
  };

  return main();
};
