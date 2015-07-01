'use strict';

var _             = require('underscore');
var ConfigProfile = require('./profile');

/**
 * Wraps the configuration profiles and adds type safety
 *
 * @param {Object} rawProflies
 */
module.exports = function ConfigProfiles(rawProfiles) {
  var profiles = _.mapObject(rawProfiles, function(rawProfile, key) {
    return ConfigProfile.fromConfig(key, rawProfile);
  });

  /**
   * Gets a configuration profile
   *
   * @param {String} name - name of profile
   * @return {ConfigProfile}
   * @throws {Error} Invalid profile name
   */
  this.get = function(name) {
    if (!name) return new ConfigProfile('');
    if(typeof profiles[name] === 'undefined') {
      throw new Error('Profile ' + name + ' does not exist');
    }
    return profiles[name];
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

  this.apply = function(f) {
    _.values(profiles).forEach(f);
  };

};
