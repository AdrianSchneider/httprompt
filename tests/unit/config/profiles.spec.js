'use strict';

var expect         = require('chai').expect;
var ConfigProfile  = require('../../../src/config/profile');
var ConfigProfiles = require('../../../src/config/profiles');

describe('Config Profiles', function() {

  beforeEach(function() {
    this.data = {
      default: {
        baseUrl: "http://localhost",
        actions: {},
        vars: {},
        startupTasks: [],
        requestOptions: {}
      }
    };
    this.profiles = new ConfigProfiles(this.data);
  });

  describe('#get', function() {

    it('Returns a mock profile for an empty string', function() {
      var profile = this.profiles.get('');
      expect(profile).to.be.an.instanceof(ConfigProfile);
      expect(profile.getName()).to.equal('');
    });

    it('Throws an error when profile is not found', function() {
      var f = function() { this.profiles.get('made up'); }.bind(this);
      expect(f).to.throw(Error, 'not exist');
    });

    it('Returns a ConfigProfile when it exists', function() {
      var profile = this.profiles.get('default');
      expect(profile).to.be.an.instanceof(ConfigProfile);
      expect(profile.getName()).to.equal('default');
    });

  });

  describe('#getList', function() {

    it('Returns an array of all of the profile names', function() {
      expect(this.profiles.getList()).to.deep.equal(['default']);
    });

  });

  describe('#add', function() {

    it('Throws an Error when that name already exists', function() {
      var f = function() { this.profiles.add('default', ''); }.bind(this);
      expect(f).to.throw(Error, 'exists');
    });

    it('Adds a new profile', function() {
      this.profiles.add('newprofile', 'http://');
      expect(!!this.profiles.get('newprofile')).to.not.equal(false);
    });

  });

  describe('#remove', function() {

    it('Throws an error when profile does not exist', function() {
      var f = function() { this.profiles.remove('madeup'); }.bind(this);
      expect(f).to.throw(Error, 'does not exist');
    });

    it('Removes the profile', function() {
      this.profiles.remove('default');
      var f = function() { this.profiles.get('default'); }.bind(this);
      expect(f).to.throw(Error, 'does not exist');
    });

  });

  describe('#apply', function() {

    it('Applies function to all members', function() {
      var names = [];
      this.profiles.apply(function(profile) { names.push(profile.getName()); });
      expect(names).to.deep.equal(['default']);
    });

  });

  describe('#serialize', function() {

    it('Returns an object of all the serialized profiles', function() {
      expect(this.profiles.serialize()).to.deep.equal(this.data);
    });

  });

});
