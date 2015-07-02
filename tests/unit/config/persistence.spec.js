'use strict';

var expect            = require('chai').expect;
var nodemock          = require('nodemock');
var Config            = require('../../../src/config/config');
var ConfigPersistence = require('../../../src/config/persistence');

describe('Config Persistence', function() {

  beforeEach(function() {
    this.fs = nodemock.mock();
    this.defaults = { "app": "httprompt" };
    this.parsed = JSON.stringify(this.defaults, null, 2);
    this.persistence = new ConfigPersistence('/filename', this.defaults, this.fs);
  });

  afterEach(function() {
    this.fs.assertThrows();
  });

  describe('#load', function() {

    it('Creates a new file if it doesnt exist yet', function(done) {
      this.fs
        .mock('exists')
        .takes('/filename', function(){})
        .calls(1, [false]);

      this.fs
        .mock('writeFile')
        .takes('/filename', this.parsed, function(){})
        .calls(2, [null]);

      this.fs
        .mock('readFile')
        .takes('/filename', function(){})
        .calls(1, [null, this.parsed]);

      this.persistence.load(done);
    });

    it('Loads the config from disk', function(done) {
      this.fs
        .mock('exists')
        .takes('/filename', function(){})
        .calls(1, [true]);

      this.fs
        .mock('readFile')
        .takes('/filename', function(){})
        .calls(1, [null, this.parsed]);

      this.persistence.load(function(err, config) {
        if (err) return done(err);
        expect(config.get('app')).to.equal('httprompt');
        done();
      });
    });

  });

  describe('#save', function() {

    beforeEach(function() {
      this.config = new Config({ changed: true });
      this.configString = JSON.stringify({ changed: true }, null, 2);
    });

    it('Ensures file exists', function(done) {
      this.fs
        .mock('exists')
        .takes('/filename', function(){})
        .calls(1, [false]);

      this.fs
        .mock('writeFile')
        .takes('/filename', this.parsed, function(){})
        .calls(2, [null]);

      this.fs
        .mock('writeFile')
        .takes('/filename', this.configString, function(){})
        .calls(2, [null]);

      this.persistence.save(this.config, done);
    });

    it('Writes thew new config to disk', function(done) {
      this.fs
        .mock('exists')
        .takes('/filename', function(){})
        .calls(1, [true]);

      this.fs
        .mock('writeFile')
        .takes('/filename', this.configString, function(){})
        .calls(2, [null]);

      this.persistence.save(this.config, done);
    });

  });

});
