'use strict';

var util         = require('util');
var EventEmitter = require('events').EventEmitter;
var ConfigProfile = require('../config/profile');

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
  this.switchProfile = function(name) {
    profile = profiles.get(name);
    profiles.apply(function(p) { p.deactivate(); });
    profile.activate(this);
    this.emit('profiles.switch', profile);
  };

  if (profileName) this.switchProfile(profileName);
}

util.inherits(Session, EventEmitter);
module.exports = Session;
