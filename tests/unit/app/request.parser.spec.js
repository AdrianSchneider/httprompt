'use strict';

var expect = require('chai').expect;
var parse  = require('../../../src/app/request.parser');

describe('Request Parser', function() {

  it('Accepts valid JSON', function() {
    expect(parse('{ "key": "value" }')).to.deep.equal({ key: 'value' });
  });

  it('Parses basic key=value pairs', function() {
    expect(parse('a=b c=d')).to.deep.equal({ a: 'b', c: 'd' });
  });

  it('Supports complex keys', function() {
    expect(parse('ab-cD=5 d.e=6')).to.have.keys(['ab-cD', 'd.e']);
  });

  it('Converts values to numbers if not quoted', function() {
    expect(parse('a=5')).to.deep.equal({ a: 5 });
  });

  it('Quoted values are always casted to string', function() {
    expect(parse('a="5"')).to.deep.equal({ a: '5' });
  });

  it('Quoted values are always casted to string', function() {
    expect(parse('a="5"')).to.deep.equal({ a: '5' });
    expect(parse('a="true"')).to.deep.equal({ a: 'true' });
  });

  it('Converts booleans', function() {
    expect(parse('a=true b=false')).to.deep.equal({ a: true, b: false });
  });

  it('Quoted booleans are strings', function() {
    expect(parse('a="true"')).to.deep.equal({ a: "true" });
  });

  it('Handles spaces in quotes', function() {
    expect(parse('a="complex value" b=false')).to.deep.equal({ a: "complex value", b: false });
  });

});
