'use strict';

module.exports = function HttpResponse(res, body) {
  this.getResponseCode = function() {
    return res.responseCode;
  };

  this.getHeaders = function() {
    return res.headers;
  };

  this.getBody = function() {
    return body;
  };

};
