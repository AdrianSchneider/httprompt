'use strict';

/**
 * Returns a renderer by name
 */
module.exports = function(name) {
  try {
    return require('./renderers/' + name);
  } catch (e) {
    throw new Error('Renderer ' + name + ' does not exist');
  }
};
