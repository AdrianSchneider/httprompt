'use strict';

var util         = require('util');
var EventEmitter = require('events').EventEmitter;

function User(config) {
  EventEmitter.call(this);

  /**
   * Switches the active profile
   * @param {String} name
   */
  this.switchProfile = function(name) {
    config.getProfiles().switchTo(name);
    this.emit('profiles.switch', this.getActiveProfile());
  };

  this.log = function(line, data) {
    this.getSession().history.log(line, data);
  };

  this.getSession = function() {
    return config.getProfiles().getActive().getSession();
  };

  this.getActiveProfile = function() {
    return config.getProfiles().getActive();
  };
}

util.inherits(User, EventEmitter);
module.exports = User;
