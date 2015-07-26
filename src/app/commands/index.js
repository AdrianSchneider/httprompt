'use strict';

/**
 * Returns all of the commands with their dependencies injected from the container
 *
 * @param {ServiceContainer} container
 * @return {Array<Command>}
 */
module.exports = function(container) {
  return [
    require('./help')(),
    require('./config')(container.get('config')),
    require('./history')(container.get('session'), container.get('renderer')),
    require('./profiles')(container.get('config'), container.get('session')),
    require('./http')(container.get('httpClient')),
    require('./httpHeaders')(container.get('session')),
    require('./vars')(container.get('session'))
  ].reduce(function(out, items) {
    return out.concat(items);
  }, []);
};
