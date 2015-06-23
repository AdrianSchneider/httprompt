'use strict';

module.exports = function ServerProfile(baseUrl) {

  this.buildUrl = function(path, config) {
    return baseUrl + path;
  };

  this.buildOptions = function(query, data, headers) {
    return {
      json    : data    || {},
      query   : query   || {},
      headers : headers || {}
    };
  };

};
