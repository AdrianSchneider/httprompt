'use strict';

/**
 * Represents a user request
 *
 * @param {String} line
 */
module.exports = function Request(line) {
  var params = {};

  this.getLine = function() {
    return line;
  };

  this.set = function(key, value) {
    params[key] = value;
  };

  this.get = function(key) {
    return params[key];
  };

};
