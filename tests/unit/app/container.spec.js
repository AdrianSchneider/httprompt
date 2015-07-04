'use strict';

var expect           = require('chai').expect;
var ServiceContainer = require('../../../src/app/container');

describe('Service Container', function() {

  beforeEach(function() {
    this.container = new ServiceContainer();
  });

  it('Can set and then get a new service', function() {
    var service = function() { return 'ok'; };
    this.container.set('f', service);
    expect(this.container.get('f')).to.deep.equal(service);
  });

  it('Cannot set a service twice', function() {
    this.container.set('f', 'asdflkasjdfl');
    var f = function() { this.container.set('f', 'asdflkasjdfl'); }.bind(this);
    expect(f).to.throw(Error, 'already registered');
  });

  it('Cannot get a service that does not exist', function() {
    var f = function() { this.container.get('anything'); }.bind(this);
    expect(f).to.throw(Error, 'not registered');
  });

});
