'use strict';

var _             = require('underscore');
var EventEmitter  = require('events').EventEmitter;
var util          = require('util');
var ConfigProfile = require('./profile');

/**
 * Wraps the configuration profiles and adds type safety
 *
 * @param {Object} rawProflies
 */
function ConfigProfiles(rawProfiles) {
  var active;
  var profiles = _.mapObject(rawProfiles, function(rawProfile) {
    return ConfigProfile.fromConfig(rawProfile);
  });

  /**
   * Gets a configuration profile
   *
   * @param {String} name - name of profile
   * @return {ConfigProfile}
   * @throws {Error} Invalid profile name
   */
  this.get = function(name) {
    if(typeof profiles[name] === 'undefined') {
      throw new Error('Profile ' + name + ' does not exist');
    }
    return profiles[name];
  };

  /**
   * Gets the active configuration profile
   * Sets an empty one if none is active yet
   *
   * @return {ConfigProfile}
   */
  this.getActive = function() {
    if(!active) active = new ConfigProfile('');
    return active;
  };

  /**
   * Switches to another profile
   *
   * @param {String} profileName
   */
  this.switchTo = function(profileName) {
    var profile = this.get(profileName);
    profile.activate();
    active = profile;
    this.emit('switch', profileName);
  };

  /**
   * Returns a list of profiles
   *
   * @return {Array}
   */
  this.getList = function() {
    return Object.keys(profiles);
  };

  this.add = function(rawData) {};
  this.remove = function(name) {};

}

util.inherits(ConfigProfiles, EventEmitter);
module.exports = ConfigProfiles;
