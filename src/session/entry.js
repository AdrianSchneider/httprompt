'use strict';

module.exports = function Entry(line, response) {
  var date = new Date();

  this.getLine = function() {
    return line;
  };

  this.getResponse = function() {
    return response;
  };

  this.getDate = function() {
    return date;
  };

};
