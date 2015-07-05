'use strict';

var expect       = require('chai').expect;
var nodemock     = require('nodemock');
var Session      = require('../../../src/session/session');
var Profile      = require('../../../src/config/profile');
var Profiles     = require('../../../src/config/profiles');
var Request      = require('../../../src/app/request');
var Response     = require('../../../src/app/response');
var HttpResponse = require('../../../src/http/response');

describe('Session', function() {

  beforeEach(function() {
    this.dispatcher = nodemock.mock();
  });

  afterEach(function() {
    this.dispatcher.assertThrows();
  });

  describe('Construction', function() {

    it('Starts off without a profile set', function() {
      var session = new Session(new Profiles({ profileName: {} }), 'profileName');
      expect(session.getProfile()).to.equal(undefined);
    });
  });

  describe('#switchProfile', function() {

    beforeEach(function() {
      this.profiles = new Profiles({
        default : {},
        a       : {},
        b       : {},
        c       : {}
      });
    });

    it('Deactivates all profiles', function(done) {
      var session = new Session(this.profiles, 'default');
      session.switchProfile('c', this.dispatcher, function(err) {
        if (err) return done(err);
        expect(this.profiles.get('default').isActive()).to.equal(false);
        expect(this.profiles.get('a').isActive()).to.equal(false);
        expect(this.profiles.get('b').isActive()).to.equal(false);
        done();
      }.bind(this));
    });

    it('Activates the selected profile', function(done) {
      var session = new Session(this.profiles, 'default');
      session.switchProfile('c', this.dispatcher, function(err) {
        if (err) return done(err);
        expect(this.profiles.get('c').isActive()).to.equal(true);
        done();
      }.bind(this));
    });

    it('Emits a profiles.switch event', function(done) {
      var session = new Session(this.profiles, 'default');
      session.on('profiles.switch', function(profile) {
        expect(profile.getName()).to.equal('a');
        done();
      }.bind(this));
      session.switchProfile('a', this.dispatcher, function(){});
    });

  });

  describe('#log', function() {

    it('Logs HttpResponses as an "entry" event', function(done) {
      var session = new Session(new Profiles({ profileName: {} }), 'profileName');
      var request = new Request();
      var response = new HttpResponse();

      session.on('entry', function(req, res) {
        expect(req).to.deep.equal(request);
        expect(res).to.deep.equal(res);
        done();
      });

      session.log(request, response);
    });

    it('Skips any other logged responses', function() {
      var session = new Session(new Profiles({ profileName: {} }), 'profileName');
      var request = new Request();
      var response = new Response();

      session.on('entry', function(req, res) {
        throw new Error('Should not have triggered this');
      });

      session.log(request, response);
    });

  });

  describe('Session Namespace Helpers', function() {

    describe('#buildUrl', function() {
      it('Delegates to the profile');
    });

    describe('#buildOptions', function() {
      it('Delegates to the session namespace');
    });

    describe('#setHeader', function() {
      it('Delegates to the session namespace');
    });

    describe('#setNextHeader', function() {
      it('Delegates to the session namespace');
    });

    describe('#unsetHeader', function() {
      it('Delegates to the session namespace');
    });

    describe('#getLastResponse', function() {
      it('Gets the last history from the session namespace history');
    });

  });

});
