'use strict';

module.exports = function Config(data) {
  /**
   * Checks if a key exists
   *
   * @param {String} key
   * @return {Boolean}
   */
  this.has = function(key) {
    return typeof data[key] !== 'undefined';
  };

  /**
   * Gets the config value by its key
   *
   * @param {String} key
   * @return {*} the config value
   */
  this.get = function(key) {
    return data[key];
  };

  /**
   * Sets a new value for a given key
   *
   * @param {String} key
   * @param {*} value
   */
  this.set = function(key, value) {
    data[key] = value;
  };

  /**
   * Serializes the data
   *
   * @return {String}
   */
  this.serialize = function() {
    return JSON.stringify(data, null, 2);
  };

};
