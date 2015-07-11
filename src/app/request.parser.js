'use strict';

/**
 * Takes user input and converts it into an object
 *
 * Supports JSON, or key=value pairs
 *
 * @param {String} input
 * @return {Object}
 */
module.exports = function(input) {
  if(input) {
    try {
      return JSON.parse(input);
    } catch (e) { }
  }

  var out = {};
  var result;
  var pattern = /([-\.a-z0-9]+)\=(("([^"]*)")|([^ ]*))/gi;

  while ((result = pattern.exec(input)) !== null) {
    out[result[1]] = resultToValue(result);
  }

  return out;
};

function resultToValue(result) {
  // Quoted
  if(result[4]) {
    return "" + result[4];
  }

  // Numeric
  if(/^([0-9]+)$/.test(result[2])) {
    return +result[2];
  }

  // Boolean
  if(result[2].toLowerCase() === 'true')  return true;
  if(result[2].toLowerCase() === 'false') return false;

  return result[2];

}
