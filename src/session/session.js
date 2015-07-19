'use strict';

var _             = require('underscore');
var util          = require('util');
var EventEmitter  = require('events').EventEmitter;
var ConfigProfile = require('../config/profile');
var HttpResponse  = require('../http/response');
var Entry         = require('./entry');
var History       = require('./history');

/**
 * Represents the user's session with the prompt
 *
 * @param {ConfigProfiles}     profiles
 * @param {SessionWriter|null} writer
 */
function Session(profiles, writer) {
  EventEmitter.call(this);
  var profile;
  var history = new History();

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
      history.log(new Entry(request, response));
      this.emit('entry', request, response);
    }
  };

  /**
   * Called when the user's session has ended
   */
  this.end = function(done) {
    if (!writer) return done();
    return writer.write(history, done);
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
    return _.extend(
      profile.getSession().buildOptions(query, data, headers),
      profile.getRequestOptions()
    );
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
