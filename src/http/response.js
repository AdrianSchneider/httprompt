'use strict';

var http = require('http');

module.exports = function HttpResponse(res, body) {
  this.getResponseCode = function() {
    return res.statusCode;
  };

  this.getHeaders = function() {
    return res.headers;
  };

  this.getBody = function() {
    return body;
  };

  this.serialize = function() {
    return dumpRequest(res) + '\n' + dumpResponse(res) + '\n' + JSON.stringify(body, null, 2);
  };

};

function formatHeader(header) {
   return header.replace(/(^| |-)(\w)/g, function(x) {
    return x.toUpperCase();
  });
}

function dumpRequest(res) {
  var out = '';

  out += res.request.method + ' ' + res.request.uri.path + "\n";
  Object.keys(res.request.headers).forEach(function(header) {
    out += formatHeader(header) + ": " + res.request.headers[header] + "\n";
  });

  return out;
}

function dumpResponse(res) {
  var out = '';

  out += res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] + "\n";
  Object.keys(res.headers).forEach(function(header) {
    out += formatHeader(header) + ": " + res.headers[header] + "\n";
  });

  return out;
}
