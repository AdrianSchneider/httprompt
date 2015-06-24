'use strict';

var expect         = require('chai').expect;
var ConfigCommands = require('../../../../src/ui/commands/config');

describe('Config Commands', function() {

  beforeEach(function() {
    this.config = {
      verbose: true,
      number: 1,
      string: 'string'
    };

    this.command = new ConfigCommands(this.config);
  });

  describe('Matching', function() {

    it('Doesnt match config', function() {
      expect(this.command.match('config')).to.equal(false);
    });

    it('Matches config set', function() {
      expect(this.command.match('config set a b')).to.equal(true);
    });

    it('Matches config get', function() {
      expect(this.command.match('config get a')).to.equal(true);
    });

    it('Matches config list', function() {
      expect(this.command.match('config list')).to.equal(true);
    });

  });

  describe('Processing', function() {

    describe('config list', function() {

      it('Returns an array of config help lines', function() {
        expect(this.command.getHelp()).to.be.a('array');
      });

    });

    describe('config get', function() {

      it('Errors without a key', function(done) {
        this.command.process('config get ', function(err) {
          expect(err.message).to.contain('does not exist');
          done();
        });
      });

      it('Returns the config value requested', function(done) {
        this.command.process('config get string', function(err, item) {
          expect(item).to.equal('string');
          done();
        });
      });

    });

    describe('config set', function() {

      it('Errors without a key', function(done) {
        this.command.process('config set ', function(err) {
          expect(err.message).to.contain('does not exist');
          done();
        });
      });

      it('Sets the key', function(done) {
        this.command.process('config set string anotherstring ', function(err) {
          expect(this.config.string).to.equal('anotherstring');
          done();
        }.bind(this));
      });

      it('Casts true to boolean', function(done) {
        this.command.process('config set number true ', function(err) {
          expect(this.config.number).to.equal(true);
          done();
        }.bind(this));
      });

      it('Casts false to boolean', function(done) {
        this.command.process('config set number false ', function(err) {
          expect(this.config.number).to.equal(false);
          done();
        }.bind(this));
      });

      it('Casts numbers to numbers', function(done) {
        this.command.process('config set number 12345 ', function(err) {
          expect(this.config.number).to.equal(12345);
          done();
        }.bind(this));
      });

    });

  });

});
