'use strict';

/**
 * HTTP Client Command Handlers
 * Intercepts any commands that look like HTTP calls
 *
 * @author Adrian Schneider <adrian@compiledintent.com>
 * @param {HttpClient} client
 */
module.exports = function HttpCommands(client) {

  /**
   * Matches any supported HTTP methods
   *
   * @param  {String} line - an input line from the repl
   * @return {Boolean}
   */
  this.match = function(line) {
    return /^(get|put|post|delete|options|patch|head) /i.test(line);
  };

  /**
   * Processes a line of input that has been matched
   *
   * @param {String} line   - an input line from the repl
   * @param {Function} done - called when complete
   */
  this.process = function(line, done) {
    var parts = line.split(' ', 3);

    var method = parts[0].toLowerCase();
    var url = parts[1];
    var payload = parts[2];

    if (payload) {
      try {
        payload = JSON.parse(payload);
      } catch (e) {
        payload = null;
      }
    }

    var commands = {
      'get'    : handleGet,
      'post'   : handlePost,
      'put'    : handlePut,
      'delete' : handleDelete
    };

    commands[method](url, payload, done);
  };

  /**
   * Called for GET requests
   *
   * @param {String}   url
   * @param {Function} done
   */
  var handleGet = function(url, payload, done) {
    client.get(url, {}, done);
  };

  /**
   * Called for POST requests
   *
   * @param {String}   url
   * @param {Object}   data
   * @param {Function} done
   */
  var handlePost = function(url, data, done) {
    client.post(url, data, done);
  };

  /**
   * Called for PUT requests
   *
   * @param {String}   url
   * @param {Object}   data
   * @param {Function} done
   */
  var handlePut = function(url, data, done) {
    client.put(url, data, done);
  };

  /**
   * Called for DELETE requests
   *
   * @param {String}   url
   * @param {Function} done
   */
  var handleDelete = function(url, payload, done) {
    client.delete(url, done);
  };
};
