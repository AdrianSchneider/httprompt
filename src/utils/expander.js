'use strict';

module.exports = function(str, input, config, response) {
  return str.replace(
    /\$\(([^)]+)\)/g,
    function(full, token) {
      var parts = token.split('.');
      var type = parts[0];
      var name = parts.slice(1).join('.');
      if (type === 'input') return input[name];

      throw new Error('todo');
    }
  );
};
