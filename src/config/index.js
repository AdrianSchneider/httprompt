'use strict';

var _                 = require('underscore');
var ConfigProfiles    = require('./profiles');
var ConfigPersistence = require('./persistence');

/**
 * Wraps the raw config object adding a bit of safety
 * and collecting the configuration profiles
 *
 * @param {Object} data
 */
module.exports = function Config(filename) {
  var data;
  var profiles;
  var persistence = new ConfigPersistence(filename, require('./defaults.json'));

  /**
   * Loads the config from disk
   *
   * @param {Function} done
   */
  this.load = function(done) {
    persistence.load(function(err, config) {
      if (err) return done(err);
      data = config;
      profiles = new ConfigProfiles(config.get('profiles'));
      return done();
    });
  };

  /**
   * Saves the config back to disk
   *
   * @param {Function} done
   */
  this.save = function(done) {
    if (!data) throw new Error('Cannot save until loaded');
    persistence.save(data, done);
  };

  /**
   * Checks if a key exists
   *
   * @param {String} key
   * @return {Boolean}
   */
  this.has = function(key) {
    if (!data) throw new Error('Cannot use config before loading it');
    return data.has(key);
  };

  /**
   * Gets the config value by its key
   *
   * @param {String} key
   * @return {*} the config value
   */
  this.get = function(key) {
    if (!data) throw new Error('Cannot use config before loading it');
    return data.get(key);
  };

  /**
   * Sets a new value for a given key
   *
   * @param {String} key
   * @param {*} value
   */
  this.set = function(key, value) {
    if (!data) throw new Error('Cannot use config before loading it');
    return data.set(key, value);
  };

  this.getProfiles = function() {
    return profiles;
  };

  this.getFilename = function() {
    return filename;
  };

  this.getGlobals = function() {
    return _.omit(
      JSON.parse(data.serialize()),
      'profiles'
    );
  };

};
