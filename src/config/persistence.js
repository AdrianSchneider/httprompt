'use strict';

var _        = require('underscore');
var fs       = require('fs');
var path     = require('path');
var async    = require('async');
var Config   = require('./config');
var defaults = require('./defaults.json');

module.exports = function ConfigPersistence(filename) {
  /**
   * Loads the user's config
   *
   * @param {Function} done - returns the Config object
   */
  this.load = function(done) {
    async.waterfall([ensureExists, async.apply(fs.readFile, filename), parseFile, toConfig], done);
  };

  /**
   * Ensures the local config file exists before continuing
   *
   * @param {Function} done
   */
  var ensureExists = function(done) {
    fs.exists(filename, function(exists) {
      if (exists) return done();
      fs.writeFile(filename, JSON.stringify(defaults, null, 2), function(err) {
        done(err);
      });
    });
  };

  /**
   * Parses and extracts JSON from the local config file
   *
   * @param {String} contents - raw JSON
   * @param {Function} done - called with parsed JSON
   * @throws {Exception} Config data must be valid JSON
   */
  var parseFile = function(contents, done) {
    var data;
    try {
      data = JSON.parse(contents);
    } catch (e) {
      throw new Error('Your config file at ~/.httprompt.json is corrupt. Fix it or delete it to continue');
    }
    done(null, data);
  };

  /**
   * Converts the raw config data into a Config object
   *
   * @param {Object} data - raw config data
   * @param {Function} done - called with Config instance
   */
  var toConfig = function(data, done) {
    return done(null, new Config(data));
  };

  /**
   * Writes the in-memory configuration back to disk
   *
   * @param {Config} config
   * @param {Function} done
   */
  this.save = function(config, done) {
    async.series([
      ensureExists,
      async.apply(fs.writeFile, filename, config.serialize)
    ]);
  };
};
