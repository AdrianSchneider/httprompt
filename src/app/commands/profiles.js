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
      new Command('profile vars set <key> <value>',  profileSet)
    ];
  };

  var listProfiles = function(request, done) {
    done(null, config.getProfiles().getList().sort());
  };

  var switchProfile = function(request, done) {
    try {
      session.switchProfile(request.get('name'), this.getDispatcher(), done);
    } catch (e) {
      return done(e);
    }
  };

  var addProfile = function(request, done) {
    try {
      config.getProfiles().add(request.get('name'), request.get('baseUrl'));
      done();
    } catch (e) {
      return done(e);
    }
  };

  var removeProfile = function(request, done) {
    try {
      config.getProfiles().remove(request.get('name'));
      done();
    } catch (e) {
      return done(e);
    }
  };

  var listVars = function(request, done) {
    done(null, session.getProfile().getVariables());
  };

  var profileSet = function(request, done) {
    session.getProfile().setVariable(request.get('key'), request.get('value'));
    done();
  };

  return main();
};
