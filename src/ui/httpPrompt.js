'use strict';

var util              = require('util');
var PromptApplication = require('../ui/application');

/**
 * HTTP Client Prompt
 *
 * Takes user input and converts them into client calls, emitting a response on completion
 */
function HttpPrompt(client) {
  PromptApplication.call(this);
  var prompt = this;

  this.input = function(line) {
    prompt.emit('output', {
      body: 'sup'
    });
  };
}

util.inherits(HttpPrompt, PromptApplication);

module.exports = HttpPrompt;
