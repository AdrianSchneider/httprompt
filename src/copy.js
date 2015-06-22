'use strict';

var _       = require('underscore');
var async   = require('async');
var request = require('request');
var assert  = require('assert');
var Joi     = require('joi');
var expect  = require('chai').expect;


/**
 * A stateful REST client for testing
 *
 * @param string app
 * @param number port
 */
module.exports = function TestClient(app, port, saveHistory) {
  app  = app  || 'app';
  port = port || 8889;

  var history = [];
  var session = request.jar();
  var options = { json: true, jar: session, headers: { host: app + ".localhost" } };
  var nextHeaders = {};

  /**
   * Performs a GET request against url
   *
   * @param string url
   * @param object? qs
   * @param function done err,res,body
   */
  this.get = function(url, qs, done) {
    if(arguments.length == 2) {
      done = qs;
      qs = {};
    }

    request.get(
      buildUrl(url),
      attachHeaders(_.extend({}, options, { qs: qs })),
      logResponse(done)
    );
  };

  /**
   * Performs a PUT request against url using data
   *
   * @param string url
   * @param object data
   * @param function done err,res,body
   */
  this.put = function(url, data, done) {
    if(!done && typeof data === 'function') return data(new Error('Client.put exects url, data, callback'));

    request.put(
      buildUrl(url),
      attachHeaders(_.extend({}, options, { json: data })),
      logResponse(done)
    );
  };

  /**
   * Performs a POST request against url using data
   *
   * @param string url
   * @param object data
   * @param function done err,res,body
   */
  this.post = function(url, data, done) {
    if(!done && typeof data === 'function') return data(new Error('Client.post exects url, data, callback'));

    request.post(
      buildUrl(url),
      attachHeaders(_.extend({}, options, { json: data })),
      logResponse(done)
    );
  };

  /**
   * Performs a DELETE request against url using data
   *
   * @param string url
   * @param object data (optional)
   * @param function done err,res,body
   */
  this.del = function(url, data, done) {
    var opts = _.clone(options);

    if(typeof data === 'function') {
      done = data;
    } else {
      opts.json = data;
    }

    request.del(buildUrl(url), attachHeaders(opts), logResponse(done));
  };

  /**
   * Builds the URL based on the config
   *
   * @param string url (relative url)
   * @return string
   */
  var buildUrl = function(url) {
    return 'http://localhost:' + port + url;
  };

  var logResponse = function(done) {
    return function(err, res, body) {
      if(saveHistory) history.push({ res: res, body: body });
      done(err, res, body);
    };
  };

  this.follow = function(name, done) {
    if(!history.length) return done(new Error('History is not active'));

    var lastBody = _.last(history).body;
    var link = _.findWhere(lastBody._links, { rel: name });
    if(!link) return done(new Error('No link found named ' + name));

    this.get(
      link.href,
      done
    );
  };

  /**
   * Log the client in
   *
   * @param string email
   * @param string password
   * @param function done
   */
  this.login = function(email, password, done) {
    var data = {};

    if(app == 'app') {
      data.email = email;
      data.password = password;
    }  else if (app == 'student') {
      data.classroomCode = email;
      data.accessCode = password;
    } else if (app == 'parent') {
      data.email = email;
      data.accessCode = password;
    } else {
      return done(new Error('Unknown app'));
    }


    this.post('/login', data, function(err, res, body) {
      if(err) return done(err);

      if(res.statusCode !== 200 && res.statusCode !== 302) {
        console.log(data, res.statusCode, res.headers);
        return done(new Error('Could not login as ' + email));
      }

      return done();
    });

  };
  
  this.header = function(key, value) {
    nextHeaders[key] = value;
  };

  /**
   * Attaches pending headers into this next request
   *
   * @param object opts
   * @return object
   */
  var attachHeaders = function(opts) {
    var out = _.clone(opts);
    out.headers = _.extend(out.headers, nextHeaders);
    nextHeaders = {};
    return out;
  };
};
