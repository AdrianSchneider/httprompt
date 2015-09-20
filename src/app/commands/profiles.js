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
      new Command('profiles list',                   listProfiles),
      new Command('profiles switch <name>',          switchProfile),
      new Command('use <name>',                      switchProfile),
      new Command('profiles add <name> <baseUrl>',   addProfile),
      new Command('profiles remove <name>',          removeProfile),
      new Command('profile vars',                    listVars),
      new Command('profile vars set <key> <value>',  profileSet),
      new Command('profile.<key>',                   profileGet, null, 'helper')
    ];
  };

  var listProfiles = function(request) {
    return config.getProfiles().getList();
  };

  var switchProfile = function(request, done) {
    session.switchProfile(request.get('name'), this.getDispatcher(), done);
  };

  var addProfile = function(request) {
    config.getProfiles().add(request.get('name'), request.get('baseUrl'));
  };

  var removeProfile = function(request) {
    config.getProfiles().remove(request.get('name'));
  };

  var listVars = function(request) {
    return session.getProfile().getVariables();
  };

  var profileSet = function(request) {
    session.getProfile().setVariable(request.get('key'), request.get('value'));
  };

  var profileGet = function(request) {
    return session.getProfile().getVariable(request.get('key'));
  };

  return main();
};
