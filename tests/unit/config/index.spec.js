'use strict';

var expect         = require('chai').expect;
var nodemock       = require('nodemock');
var ConfigService  = require('../../../src/config');
var ConfigData     = require('../../../src/config/data');
var ConfigProfiles = require('../../../src/config/profiles');

describe('Config Service', function() {

  beforeEach(function() {
    this.persistence = nodemock.mock();
    this.data = new ConfigData({ a: "b", profiles: [] });
  });

  afterEach(function() {
    this.persistence.assertThrows();
  });

  describe('Before Loading', function() {

    describe('#load', function() {

      beforeEach(function() {
        this.config = new ConfigService('/filename', this.persistence);
      });

      it('Loads from persistence and sets config', function(done) {
        this.persistence
          .mock('load')
          .takes(function(){})
          .calls(0, [null, this.data]);

        this.config.load(done);
      });

      it('Fails when persistence fails', function(done) {
        this.persistence
          .mock('load')
          .takes(function(){})
          .calls(0, [new Error('nope')]);

        this.config.load(function(err) {
          expect(err.message).to.equal('nope');
          done();
        });
      });

    });

    it('Cannot use config before loading it', function() {
      var config = new ConfigService('/filename', this.persistence);
      var f = function() { config.save(); };
      expect(f).to.throw(Error, 'loading');
    });

    describe('#getFilename', function() {

      it('Returns the filename', function() {
        var config = new ConfigService('/filename', this.persistence);
        expect(config.getFilename()).to.equal('/filename');
      });

    });

  });

  describe('After Loading', function() {

    beforeEach(function(done) {
      this.config = new ConfigService('/filename', this.persistence);
      this.persistence
        .mock('load')
        .takes(function(){})
        .calls(0, [null, this.data]);

      this.config.load(done);
    });

    describe('#save', function() {

      it('Persists if loaded', function(done) {
        this.persistence
          .mock('save')
          .takes(this.data, function(){})
          .calls(1, []);

        this.config.save(done);
      });

    });

    describe('#has', function() {

      it('Delegates to data', function() {
        expect(this.config.has('a')).to.equal(true);
      });

    });

    describe('#get', function() {

      it('Delegates to data', function() {
        expect(this.config.get('a')).to.equal('b');
      });

    });

    describe('#set', function() {

      it('Delegates to data', function() {
        this.config.set('a', 'c');
        expect(this.config.get('a')).to.equal('c');
      });

    });

    describe('#getProflies', function() {

      it('Returns the profiles taken from config', function() {
        expect(this.config.getProfiles()).to.be.an.instanceof(ConfigProfiles);
      });

    });

    describe('#getGlobals', function() {

      it('Returns the serialized config minus profiles', function() {
        expect(this.config.getGlobals()).to.deep.equal({ a: "b" });
      });

    });

  });

});
