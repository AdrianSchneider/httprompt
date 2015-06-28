'use strict';

module.exports = function(str, input, config, response) {
  var getResponse = function(dottedKey) {
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

  return str.replace(
    /\$\(([^)]+)\)/g,
    function(full, token) {
      var parts = token.split('.');
      var type = parts[0];
      var name = parts.slice(1).join('.');
      if (type === 'input') return input[name];
      if (type === 'response') return getResponse(name);

      throw new Error('todo');
    }
  );
};
