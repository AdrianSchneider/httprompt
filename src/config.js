'use strict';

var path  = require('path');
var nconf = require('nconf');

module.exports = function() {
  nconf.file({ file: path.resolve(__dirname, '../config.js') });
  return nconf;
};
