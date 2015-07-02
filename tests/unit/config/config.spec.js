'use strict';

var expect         = require('chai').expect;
var Config         = require('../../../src/config/config');
var ConfigProfiles = require('../../../src/config/profiles');

describe('Config', function() {

  beforeEach(function() {
    this.data = { app: 'httprompt', profiles: [] };
    this.config = new Config(this.data);
  });

  describe('#has', function() {

    it('Returns true when exists', function() {
      expect(this.config.has('app')).to.equal(true);
    });

    it('Returns false when does not exist', function() {
      expect(this.config.has('made up key')).to.equal(false);
    });

  });

  describe('#get', function() {

    it('Returns the value when it exists', function() {
      expect(this.config.get('app')).to.equal('httprompt');
    });

    it('Throws an Error when key does not exist', function() {
      var f = function() { this.config.get('made up'); }.bind(this);
      expect(f).to.throw(Error, 'made up');
    });

  });

  describe('#set', function() {

    it('Sets a new config value', function() {
      this.config.set('app', 'new name');
      expect(this.config.get('app')).to.equal('new name');
    });

    it('Throws an Error when a new key is introduced', function() {
      var f = function() { this.config.set('made up', 'wat'); }.bind(this);
      expect(f).to.throw(Error, 'made up');
    });

  });

  describe('#serialize', function() {

    it('Stringifies all of the config for storage', function() {
      var expected = JSON.stringify(this.data, null, 2);
      expect(this.config.serialize()).to.equal(expected);
    });

  });

  describe('#getGlobals', function() {

    it('Returns all of the config globals', function() {
      expect(this.config.getGlobals()).to.deep.equal({ app: 'httprompt' });
    });

  });

  describe('#getProfiles', function() {

    it('Converts the raw config profiles into a ConfigProfiles', function() {
      expect(this.config.getProfiles()).to.be.an.instanceof(ConfigProfiles);
    });

  });

});
