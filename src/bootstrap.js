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

/**
 * Application setup
 * Exports a ready Prompt
 *
 * @param {Stream}   stdin
 * @param {Stream}   stdout
 * @param {String}   profileName
 * @param {Function} done
 */
module.exports = function(config, stdin, stdout, profileName, done) {
  var container = new ServiceContainer();
  try {
    container.set('config', config);
    container.set('session', new Session(config.getProfiles(), profileName));
    container.set('renderer', new Renderer(config, {
      console : require('./ui/renderers/console'),
      jsonfui : require('./ui/renderers/jsonfui'),
      less    : require('./ui/renderers/less')
    }));

    container.set('httpClient', new HttpClient(container.get('session')));
  } catch (e) {
    return done(e);
  }

  var dispatcher = new Dispatcher(container.get('session'), commands(container), config);
  var prompt = new Prompt(
    readline,
    dispatcher,
    container.get('renderer'),
    { input: stdin, output: stdout }
  );

  if (profileName !== 'default') {
    prompt.rename(container.get('session').getProfile().getName());
  }

  container.get('session').on('profiles.switch', function(profile) {
    prompt.rename(profile.getName());
  });

  async.eachSeries(container.get('session').getProfile().getStartupTasks(), function(line, next) {
    dispatcher.dispatch(new Request(line), next);
  }, function(err) {
    if (err) return done(err);
    return done(null, prompt);
  });
};
