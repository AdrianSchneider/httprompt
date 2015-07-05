'use strict';

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
  var rl = readline.createInterface(options);

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
   *
   * @param {String} line - line from repl
   */
  var onLine = function(line) {
    rl.pause();
    if (line === '') return afterResponse();

    dispatcher.dispatch(new Request(line), function(err, matched, result) {
      if (err) return renderer.render('console', err, afterResponse);
      if (!matched) return renderer.render('console', new Error('Unknown command; type "help" for some ideas'), afterResponse);
      renderer.render('console', result, afterResponse);
    });
  };

  /**
   * Called after rendering
   */
  var afterResponse = function() {
    rl.prompt();
  };

  rl.on('line', onLine);
};
