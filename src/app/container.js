'use strict';

/**
 * Service container
 */
module.exports = function ServiceContainer() {
  var services = {};

  /**
   * Registers a service with the container
   *
   * @param {String} serviceName
   * @param {*} service
   * @throws {Error} when already registered
   */
  this.set = function(serviceName, service) {
    if (typeof services[serviceName] !== 'undefined') {
      throw new Error(serviceName + ' is already registered with the container');
    }

    services[serviceName] = service;
  };

  /**
   * Gets a service from the container
   *
   * @param {String} serviceName
   * @return {*}
   * @throws {Error} when not registered
   */
  this.get = function(serviceName) {
    if (typeof services[serviceName] === 'undefined') {
      throw new Error(serviceName + ' is not registered with the container');
    }

    return services[serviceName];
  };

};
