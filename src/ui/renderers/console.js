'use strict';

/**
 * Handles renderering to the console
 *
 * @param {Object} console - global console object
 * @param {Number} spaces - default spaces for JSON serialization
 */
module.exports = function ConsoleRenderer(console, spaces) {

  /**
   * Renders a response
   *
   * @param {Mixed} response
   * @param {Function} done err
   */
  this.renderResponse = function(response, done) {
    if(!response) return done();

    if(typeof response === 'string') {
      console.log(response);
      return done();
    }

    console.log(typeof response.serialize !== 'undefined' ? response.serialize() : JSON.stringify(response, null, spaces));
    done();
  };

  /**
   * Renders an error
   *
   * @param {Error} error
   * @param {Function} done err
   */
  this.renderError = function(error, done) {
    console.log('Error:', error.message);
    done();
  };

};
