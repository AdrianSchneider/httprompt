'use strict';

module.exports = function BaseCommand() {
  var dispatcher;

  /**
   * Sets the dispatcher
   *
   * @param {Dispatcher} d d d d
   */
  this.setDispatcher = function(d) {
    dispatcher = d;
  };

};
