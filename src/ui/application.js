'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;

function PromptApplication() {
  EventEmitter.call(this);
  this.input = function(line) {};
}

util.inherits(PromptApplication, EventEmitter);

module.exports = PromptApplication;
