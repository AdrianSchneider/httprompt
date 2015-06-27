'use strict';

var request           = require('request');
var readline          = require('readline');
var Prompt            = require('./ui/prompt');
var Profile           = require('./ui/profile');
var HttpCommands      = require('./ui/commands/http');
var HistoryCommands   = require('./ui/commands/history');
var ConfigCommands    = require('./ui/commands/config');
var Renderer          = require('./ui/renderer');
var HttpClient        = require('./http/client');
var ConfigPersistence = require('./config/persistence');

module.exports = function(configFilename, stdin, stdout, baseUrl, done) {
  var loader = new ConfigPersistence(configFilename);
  loader.load(function(err, config) {
    if (err) return done(err);

    var renderer = new Renderer(config, {
      console: require('./ui/renderers/console'),
      jsonfui: require('./ui/renderers/jsonfui')
    });

    var client = new HttpClient(new Profile(baseUrl));

    var commandProviders = [
      new ConfigCommands(config),
      new HistoryCommands(client, renderer),
      new HttpCommands(client)
    ];

    done(null, new Prompt(
      readline,
      commandProviders,
      renderer,
      { input: stdin, output: stdout }
    ));
  });
};
