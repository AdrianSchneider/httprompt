'use strict';

var Entry = require('./entry');

/**
 * Represents a user's history of actions and responses
 */
module.exports = function History() {
  var entries = [];

  /**
   * Logs a new item
   */
  this.log = function(entry) {
    if (!(entry instanceof Entry)) {
      throw new TypeError('History.log requires an Entry');
    }
    entries.push(entry);
  };
};
