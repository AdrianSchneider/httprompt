'use strict';

var Request = require('./request');

module.exports = function(request, parentRequest, config, session) {
  var main = function() {
    return new Request(request.getLine().replace(
      /\$\(([^)]+)\)/g,
      handleReplacement
    ));
  };

  var handleReplacement = function(full, token) {
    var parts = token.split('.');
    var type = parts[0];
    var name = parts.slice(1).join('.');

    if (type === 'input')    return parentRequest.get(name);
    if (type === 'response') return getResponse(name);
    if (type === 'config')   return getConfig(name);
    if (type === 'vars')     return getVar(name);

    throw new Error('todo');
  };

  var getResponse = function(dottedKey) {
    var response = session.getLastResponse().getResponse();
    var serialized = {
      responseCode: response.getResponseCode(),
      headers: response.getHeaders(),
      body: response.getBody()
    };

    return getDotted(serialized, dottedKey);
  };

  var getDotted = function(obj, key) {
    var arr = key.split('.');
    while (arr.length && (obj = obj[arr.shift()]));
    return obj;
  };

  var getConfig = function(name) {
    return config.get(name);
  };

  var getVar = function(name) {
    return session.getProfile().getVariable(name);
  };

  return main();
};
