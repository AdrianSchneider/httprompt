#!/usr/bin/env node
'use strict';

var fs       = require('fs');
var spawn    = require('child_process').spawn;
var program  = require('commander');
var readline = require('readline');
var http     = require('http');

program
  .version('0.0.1')
  .option('-u --username [value]', 'Username')
  .option('-p --password [value]', 'Password')
  .option('-a --app [value]', 'App name (app, teacher, parent)')
  .option('-d --domain [value]', 'Base domain (freshgrade.com, localhost')
  .option('-P --port', 'Port')
  .option('-e --evaluate [value]', 'Run command directly')
  .option('-v --verbose')
  .option('-H --headers', 'Only include headers')
  .parse(process.argv);

var ApiClient = require('../server/tests/api-client');
var client = new ApiClient(program.app || 'app', program.port || 8888);

client.on('response', function(res, body) {
  if(program.verbose || program.headers) {
    console.log(dumpRequest(res) + "\n" + dumpResponse(res));
  }

  if(!program.headers) {
    var data = {
      code: res.statusCode,
      headers: res.headers,
      body: body
    };

    return fs.writeFile('/tmp/fui', JSON.stringify(data), function(err) {
      rl.pause();
      var process = spawn('jsonfui', ['-f', '/tmp/fui'], { stdio: 'inherit' });
      process.on('close', function() {
        rl.prompt();
      });
    });
  }

  if(program.evaluate) process.exit(0);
});

client.on('error', function(message) {
  var msg = 'ERROR: ' + message;

  if(program.evaluate)  {
    console.error(msg);
    process.exit(1);
  }

  console.log(msg);
});

if(program.evaluate) {
  if(program.username) {
    client.on('login', function() { client.run(program.evaluate); });
    client.run('login ' + program.username + ' ' + program.password);
    return;
  }

  client.run(program.evaluate);
}


var rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.setPrompt(getAppName(program.app) + 'App> ');

if(program.username) {
  client.on('login', function(username) {
    rl.prompt();
  });
  client.run('login ' + program.username + ' ' + program.password);
} else {
  rl.prompt();
}


rl.on('line', client.run);

client.on('login',    function(username) { console.log('Logged in as ' + username); });
client.on('login',    function() { rl.prompt(); });
client.on('response', function() { rl.prompt(); });
client.on('error',    function() { rl.prompt(); });

function formatHeader(header) {
   return header.replace(/(^| |-)(\w)/g, function(x) {
    return x.toUpperCase();
  });
}

function dumpRequest(res) {
  var out = '';

  out += res.request.method + ' ' + res.request.uri.path + "\n";
  Object.keys(res.request.headers).forEach(function(header) {
    out += formatHeader(header) + ": " + res.request.headers[header] + "\n";
  });

  return out;
}

function dumpResponse(res) {
  var out = '';

  out += res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] + "\n";
  Object.keys(res.headers).forEach(function(header) {
    out += formatHeader(header) + ": " + res.headers[header] + "\n";
  });

  return out;
}

function getAppName(app) {
  return (!app || app === 'app') ? 'teacher' : app;
}
