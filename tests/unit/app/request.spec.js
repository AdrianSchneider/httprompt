'use strict';

var expect = require('chai').expect;
var Request = require('../../../src/app/request');

describe('App Request', function() {

  beforeEach(function() {
    this.command = { fake: 'command' };
    this.simple = new Request('say hi');
    this.withData = new Request('say hi', { to: 'joe' });
  });

  describe('#getLine', function() {

    it('Returns the line', function() {
      expect(this.simple.getLine()).to.equal('say hi');
    });

  });

  describe('#getCommand & #setCommand', function() {

    it('Can get and set the command', function() {
      this.simple.setCommand(this.command);
      expect(this.simple.getCommand()).to.deep.equal(this.command);
    });

    it('Get throws an error before being set', function() {
      var f = function() { this.simple.getCommand(); }.bind(this);
      expect(f).to.throw(Error, 'No command');
    });

    it('Set throws an error when already set', function() {
      this.simple.setCommand(this.command);
      var f = function() { this.simple.setCommand(this.command); }.bind(this);
      expect(f).to.throw(Error, 'Cannot reset');
    });

  });

  describe('#get & #set', function() {

    it('Sets a value', function() {
      this.simple.set('name', 'bob');
      expect(this.simple.get('name')).to.equal('bob');
    });

    it('Throws an Error when getting an unset value', function() {
      var f = function() { this.simple.get('made up'); }.bind(this);
      expect(f).to.throw(Error, 'not set');
    });

  });

  describe('#get', function() {


  });

});
