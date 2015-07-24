'use strict';

var async   = require('async');
var Request = require('../app/request');

/**
 * Wraps a readline prompt with some application-centric events and methods
 *
 * @param {Object}     readline - require('readline')
 * @param {Dispatcher} dispatcher - converts lines into actions
 * @param {Renderer}   renderer  - Responds to errors/responses to the user
 * @param {Object}     options
 * @param {Stream}     options.input  - The input stream for the repl
 * @param {Stream}     options.output - The input stream for the repl
 */
module.exports = function Prompt(readline, dispatcher, renderer, options) {
  var name = 'httprompt> ';
  var rl;
  var queue;

  /**
   * Called on instantiate
   */
  var init = function() {
    queue = async.queue(onRequest);
    queue.drain = function() { rl.prompt(); };

    rl = readline.createInterface(options);
    rl.on('line', onLine);
  };

  /**
   * Starts and returns the prompt
   *
   * @return {readline.Interface}
   */
  this.start = function() {
    rl.setPrompt(name);
    rl.prompt();
    return rl;
  };

  /**
   * Renames the prompt with a new name
   *
   * @param {String} newName
   */
  this.rename = function(newName) {
    if (newName === 'default') newName = 'httprompt';
    name = newName + '> ';
    rl.setPrompt(name);
  };

  /**
   * Called whenever a line is received from the repl
   * Captures the request and queues it
   *
   * @param {String} line - line from repl
   */
  var onLine = function(line) {
    if (line === '') return rl.prompt();
    queue.push(new Request(line));
    rl.pause();
  };

  /**
   * Processes a request in a controlled manner
   *
   * @param {Request} request
   * @param {Function} done - notifies queue
   */
  var onRequest = function(request, done) {
    dispatcher.dispatch(request, function(err, matched, result) {
      if (err) return renderer.render('console', err, done);
      if (!matched) return renderer.render('console', new Error('Unknown command; type "help" for some ideas'), done);
      renderer.render('console', result, done);
    });

  };

  init();

};
