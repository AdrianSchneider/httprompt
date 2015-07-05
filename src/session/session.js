'use strict';

var util          = require('util');
var EventEmitter  = require('events').EventEmitter;
var ConfigProfile = require('../config/profile');
var HttpResponse  = require('../http/response');

/**
 * Represents the user's session with the prompt
 *
 * @param {ConfigProfiles} profiles
 * @param {String|null}    profileName
 */
function Session(profiles, profileName) {
  EventEmitter.call(this);
  var profile;

  /**
   * Gets the active profile
   * @return {ConfigProfile}
   */
  this.getProfile = function() {
    return profile;
  };

  /**
   * Switches the active profile
   * @param {String} name
   */
  this.switchProfile = function(name, dispatcher, done) {
    profile = profiles.get(name);
    profiles.apply(function(p) { p.deactivate(); });
    profile.activate(this, dispatcher, function(err) {
      this.emit('profiles.switch', profile);
      done(err);
    }.bind(this));
  };

  /**
   * Only log http responses to history
   *
   * @param {Request} request
   * @param {Response} response
   */
  this.log = function(request, response) {
    if (response instanceof HttpResponse) {
      this.emit('entry', request, response);
    }
  };


  /**
   * Generates a URL, combining the base URL with the additional path
   *
   * @param {String} path
   * @return {String}
   */
  this.buildUrl = function(path) {
    return profile.buildUrl(path);
  };

  /**
   * Generates the options to use for the request
   *
   * @param {Object} query
   * @param {Object} data
   * @param {Object} headers
   * @return {Object}
   */
  this.buildOptions = function(query, data, headers) {
    return profile.getSession().buildOptions(query, data, headers);
  };

  this.setHeader = function(header, value) {
    return profile.getSession().setHeader(header, value);
  };

  this.setNextHeader = function(header, value) {
    return profile.getSession().setNextHeader(header, value);
  };

  this.unsetHeader = function(header) {
    return profile.getSession().unsetHeader(header);
  };

  this.getLastResponse = function() {
    return profile.getSession().getHistory().getLastResponse();
  };
}

util.inherits(Session, EventEmitter);
module.exports = Session;
