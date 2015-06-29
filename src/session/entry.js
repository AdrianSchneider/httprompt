'use strict';

/**
 * Represents a line of history
 *
 * @param {String} line - user input that was processed
 * @param {*}      response - whatever the command gave back
 */
module.exports = function Entry(line, response) {
  var date = new Date();

  /**
   * Gets the line of input
   *
   * @return {String}
   */
  this.getLine = function() {
    return line;
  };

  /**
   * Gets the response
   *
   * @return {*}
   */
  this.getResponse = function() {
    return response;
  };

  /**
   * Gets the date of the entry
   *
   * @return {Date}
   */
  this.getDate = function() {
    return date;
  };

};
