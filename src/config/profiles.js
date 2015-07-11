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
    return Object.keys(profiles).sort();
  };

  /**
   * Adds a new profile
   *
   * @param {String} name
   * @param {String} baseUrl
   * @throws {Error} when already exists
   */
  this.add = function(name, baseUrl) {
    if (typeof profiles[name] !== 'undefined') {
      throw new Error('Profile ' + name + ' already exists');
    }

    profiles[name] = new ConfigProfile(name, baseUrl);
  };

  /**
   * Adds a new profile
   *
   * @param {String} name
   * @param {String} baseUrl
   * @throws {Error} when already exists
   */
  this.remove = function(name) {
    if (typeof profiles[name] === 'undefined') {
      throw new Error('Profile ' + name + ' does not exist');
    }

    delete profiles[name];
  };

  this.apply = function(f) {
    _.values(profiles).forEach(f);
  };

  /**
   * Serializes the profiles for storage
   *
   * @return {Object}
   */
  this.serialize = function() {
    return _.mapObject(profiles, function(profile) {
      return profile.serialize();
    });
  };

};
