'use strict';

var objectId = require('bson-objectid');
var Command  = require('./command');

/**
 * Provides data generator functions
 *
 * @return {Array<Command>}
 */
module.exports = function() {

  /**
   * Main method providing commands
   * @return {Array<Command>}
   */
  var main = function() {
    return [
      new Command('generate rand <min> <max>', generateRandomNumber, null, 'helper'),
      new Command('generate objectid', generateObjectId, null, 'helper'),
      new Command('generate timestamp', generateTimestamp, null, 'helper'),
    ];
  };

  /**
   * Generates a random number between request.min and request.max
   *
   * @param {Request}
   * @return {Number}
   */
  var generateRandomNumber = function(request) {
    return Math.floor(
      Math.random() * (request.get('max') - request.get('min') + 1) + request.get('min')
    );
  };

  /**
   * Generates a unique BSON ObjectId
   *
   * @param {Request}
   * @return {String}
   */
  var generateObjectId = function(request) {
    return objectId();
  };

  /**
   * Generates the current timestamp in ms
   *
   * @param {Request}
   * @return {Number}
   */
  var generateTimestamp = function(request) {
    return Date.now();
  };

  return main();
};
