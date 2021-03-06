'use strict';

var _             = require('underscore');
var request       = require('request');
var History       = require('./history');
var ConfigProfile = require('../config/profile');
var Entry         = require('./entry');

/**
 * Represents a user session with the prompt
 *
 * @param {ConfigProfile} profile
 */
module.exports = function SessionNamespace(profile) {
//  if (!(profile instanceof ConfigProfile)) {
//    throw new TypeError('Session requires a valid ConfigProfile');
//  }
  var headers = [];
  var nextHeaders = [];
  var history = new History();

  var jar = request.jar();

  this.getHistory = function() {
    return history;
  };

  this.getProfile = function() {
    return profile;
  };

  this.setHeader = function(header, value) {
    headers[header] = value;
  };

  this.setNextHeader = function(header, value) {
    nextHeaders[header] = value;
  };

  this.unsetHeader = function(header) {
    delete headers[header];
    delete nextHeaders[header];
  };

  this.buildUrl = function(path) {
    return profile.buildUrl(path);
  };

  this.buildOptions = function(query, data, headers) {
    return _.extend(
      { jar: jar },
      profile.buildOptions(query, data, headers)
    );
  };


  /**
   * Merges all of the headers into what hits the client
   *
   * @param {Object} headers
   * @return {Object} merged headers
   */
  this.prepareHeaders = function(specficHeaders) {
    var merged =  _.extend({}, specficHeaders, headers, nextHeaders);
    nextHeaders = {};
    return merged;
  };

  this.log = function(request, response) {
    history.log(new Entry(request, response));
  };

};
