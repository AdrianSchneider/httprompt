'use strict';

var expect = require('chai').expect;
var Entry = require('../../../src/session/entry');

describe('History Entry', function() {

  before(function() {
    this.entry = new Entry('hello world', { "said": "hello" });
  });

  describe('#getLine', function() {

    it('Returns the input line', function() {
      expect(this.entry.getLine()).to.equal('hello world');
    });

  });

  describe('#getResponse', function() {

    it('Returns the response', function() {
      expect(this.entry.getResponse()).to.deep.equal({ said: 'hello' });
    });

  });

  describe('#getDate', function() {

    it('Returns the create date', function() {
      expect(this.entry.getDate()).to.be.an.instanceof(Date);
    });

  });

});
