'use strict';

/**
 * Represents a user response
 */
module.exports = function Response(data) {

  this.getData = function() {
    return data;
  };

};
