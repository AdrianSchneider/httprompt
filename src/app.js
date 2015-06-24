'use strict';

var request        = require('request');
var Prompt         = require('./ui/prompt');
var Profile        = require('./ui/profile');
var HttpCommands   = require('./ui/commands/http');
var ConfigCommands = require('./ui/commands/config');
var Renderer       = require('./ui/renderer');
var HttpClient     = require('./http/client');

module.exports = function(config, stdin, stdout, baseUrl) {
  var commandProviders = [
    new ConfigCommands(config),
    new HttpCommands(new HttpClient(new Profile(baseUrl)))
  ];

  var prompt = new Prompt(
    commandProviders,
    new Renderer(config.renderer),
    { input: stdin, output: stdout }
  );

  return prompt;
};
