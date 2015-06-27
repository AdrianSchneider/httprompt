'use strict';

module.exports = function CustomActionCommands(profiles) {

  var setup = function() {
    profiles.on('switch', changeProfile);
  };

  this.match = function(line) {

  };

  this.process = function() {

  };

  var changeProfile = function(profile) {

  };

  setup();

};
