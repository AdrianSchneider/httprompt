'use strict';

var util         = require('util');
var readline     = require('readline');
var EventEmitter = require('events').EventEmitter;

/**
 * Wraps a readline prompt with some application-centric events and methods
 *
 * @param PromptApplication app
 * @param object options (for readline)
 */
function Prompt(app, renderer, options) {
  EventEmitter.call(this);

  var rl = readline.createInterface(options);
  var prompt = this;

  rl.on('line', app.input);
  app.on('output', renderer(this).renderResponse);
  app.on('error', renderer(this).renderError);

  this.start = function() {
    rl.prompt();
  };
}

util.inherits(Prompt, EventEmitter);
module.exports = Prompt;
