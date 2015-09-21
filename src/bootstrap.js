'use strict';

var async              = require('async');
var request            = require('request');
var readline           = require('readline');
var ServiceContainer   = require('./app/container');
var commands           = require('./app/commands');
var Dispatcher         = require('./app/dispatcher');
var Request            = require('./app/request');
var Renderer           = require('./ui/renderer');
var Prompt             = require('./ui/prompt');
var HttpClient         = require('./http/client');
var Profile            = require('./config/profile');
var Session            = require('./session/session');
var SessionWriter      = require('./session/writer');

/**
 * Application setup
 * Exports a ready Prompt
 *
 * @param {Config}   config
 * @param {Stream}   stdin
 * @param {Stream}   stdout
 * @param {String}   profileName
 * @param {Function} done
 */
module.exports = function(config, stdin, stdout, profileName, transcriptFile, done) {
  var container = new ServiceContainer();
  container.set('config', config);
  container.set('sessionWriter', transcriptFile ? new SessionWriter(transcriptFile, require('fs')) : null);
  container.set('session', new Session(config.getProfiles(), container.get('sessionWriter')));
  container.set('httpClient', new HttpClient(container.get('session')));
  container.set('renderer', new Renderer(config, {
    console : new (require('./ui/renderers/console'))(console, 2),
    jsonfui : require('./ui/renderers/jsonfui'),
    less    : require('./ui/renderers/less')
  }));


  var dispatcher = new Dispatcher(container.get('session'), commands(container), config);
  var prompt = new Prompt(
    readline,
    dispatcher,
    container.get('renderer'),
    { input: stdin, output: stdout }
  );

  container.get('session').on('profiles.switch', function(profile) {
    prompt.rename(profile.getName());
  });

  container.get('session').switchProfile(profileName, dispatcher, function(err) {
    if (err) return done(err);
    return done(null, prompt, container.get('session'));
  });
};
