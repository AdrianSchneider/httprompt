'use strict';

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
  var rl = readline.createInterface(options);
  rl.history = ['test'];
  rl.historyIndex = 0;

  /**
   * Starts the prompt
   */
  this.start = function() {
    rl.setPrompt('httprompt> ');
    rl.prompt();
    return rl;
  };

  /**
   * Called whenever a line is received from the repl
   *
   * @param {String} line - line from repl
   */
  var onLine = function(line) {
    rl.pause();
    if (line === '') return afterResponse();

    dispatcher.dispatch(line, function(err, matched, result) {
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
