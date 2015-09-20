'use strict';

var _       = require('underscore');
var Command = require('./command');
var Request = require('../../app/request');

/**
 * Provides history-related commands
 *
 * @param {Session} session
 * @param {Renderer} renderer
 * @return {Array<Command>}
 */
module.exports = function(session, renderer) {

  var main = function() {
    return [
      new Command('open', open),
      new Command('open <command>', matchOpenEmbedded, openEmbedded),
      new Command('response.<key>', getFromResponse, null, 'helper')
    ];
  };

  /**
   * Opens the last response in an external editor
   *
   * @param {Request} request
   * @param {Function} done
   */
  var open = function(request, done) {
    var entry = session.getLastResponse();
    if (!entry) return done(null, new Error('No items in history'));
    renderer.renderExternal(entry.getResponse(), done);
  };

  /**
   * Opens an embedded request in an external request
   *
   * @param {Request} request
   * @param {Function}function
   */
  var openEmbedded = function(request, done) {
    var childRequest = new Request(request.getLine().substr(5));
    this.getDispatcher().dispatch(childRequest, request, function(err, result, response) {
      if (err) return done(err);
      if (!result) return done(new Error('Unknown command: ' + childRequest.getLine()));
      renderer.renderExternal(response, done);
    });
  };

  /**
   * Retrieves a complex key from the response
   *
   * @param {Request} request
   * @return {Mixed}
   */
  var getFromResponse = function(request) {
    var response = session.getLastResponse().getResponse();
    var serialized = {
      responseCode: response.getResponseCode(),
      headers: response.getHeaders(),
      body: response.getBody()
    };

    return getDotted(serialized, request.get('key'));
  };

  /**
   * Retrieves a dotted key (x.0.z) from an object
   * @param {Object} obj
   * @param {String} key
   * @return {Mixed}
   */
  var getDotted = function(obj, key) {
    var arr = key.split('.');
    while (arr.length && (obj = obj[arr.shift()]));
    return obj;
  };

  /**
   * Matcher for things starting with "open "
   * @param {Request} request
   * @param {Boolean}
   */
  var matchOpenEmbedded = function(request) {
    return request.getLine().indexOf('open ') === 0;
  };

  return main();
};
