/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../xom/challenge');


describe('duo/challenge', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.have.length(2);
    expect(factory['@implements'][0]).to.equal('http://schemas.authnomicon.org/js/login/mfa/challenge');
    expect(factory['@implements'][1]).to.equal('http://schemas.authnomicon.org/js/login/mfa/opt/duo/challenge');
    expect(factory['@singleton']).to.equal(true);
  });
  
  describe('challenge', function() {
    var client = {
      jsonApiCall: function(){}
    };
    var idmap;
  
  
    describe('via unspecified method', function() {
      var params;
      
      before(function() {
        var result = {
          response: {
            txid: '0a0zz000-aaaa-0aa0-a000-00a0aaa00a0a'
          },
          stat: 'OK'
        };
        
        sinon.stub(client, 'jsonApiCall').yields(result);
        idmap = sinon.stub().yields(null, { username: 'johndoe' });
      });
    
      after(function() {
        client.jsonApiCall.restore();
      });
      
      before(function(done) {
        var challenge = factory(idmap, client);
        challenge({ id: '1', username: 'johndoe' }, 'XXXXXXXXXXX000X0XXXX', function(_err, _params) {
          if (_err) { return done(_err); }
          params = _params;
          done();
        });
      });
    
      it('should call id.map', function() {
        expect(idmap).to.have.been.calledOnce;
        var call = idmap.getCall(0);
        expect(call.args[0]).to.deep.equal({
          id: '1',
          username: 'johndoe'
        });
      });
    
      it('should call client#jsonApiCall', function() {
        expect(client.jsonApiCall).to.have.been.calledOnce;
        var call = client.jsonApiCall.getCall(0);
        expect(call.args[0]).to.equal('POST');
        expect(call.args[1]).to.equal('/auth/v2/auth');
        expect(call.args[2]).to.deep.equal({
          username: 'johndoe',
          device: 'XXXXXXXXXXX000X0XXXX',
          async: '1',
          factor: 'auto'
        });
      });
      
      it('should yield parameters', function() {
        expect(params.type).to.equal('oob');
        expect(params.txid).to.equal('0a0zz000-aaaa-0aa0-a000-00a0aaa00a0a');
      });
      
    }); // via out-of-band mechanism
    
    describe('failure caused by bad request', function() {
      var err, params;
      
      before(function() {
        var result = {
          code: 40001,
          message: 'Missing required request parameters',
          message_detail: 'factor',
          stat: 'FAIL'
        };
        
        sinon.stub(client, 'jsonApiCall').yields(result);
        idmap = sinon.stub().yields(null, { username: 'johndoe' });
      });
    
      after(function() {
        client.jsonApiCall.restore();
      });
      
      before(function(done) {
        var challenge = factory(idmap, client);
        challenge({ id: '1', username: 'johndoe' }, 'XXXXXXXXXXX000X0XXXX', function(_err, _params) {
          err = _err;
          params = _params;
          done();
        });
      });
    
      it('should call id.map', function() {
        expect(idmap).to.have.been.calledOnce;
        var call = idmap.getCall(0);
        expect(call.args[0]).to.deep.equal({
          id: '1',
          username: 'johndoe'
        });
      });
    
      it('should call client#jsonApiCall', function() {
        expect(client.jsonApiCall).to.have.been.calledOnce;
        var call = client.jsonApiCall.getCall(0);
        expect(call.args[0]).to.equal('POST');
        expect(call.args[1]).to.equal('/auth/v2/auth');
        expect(call.args[2]).to.deep.equal({
          username: 'johndoe',
          device: 'XXXXXXXXXXX000X0XXXX',
          async: '1',
          factor: 'auto'
        });
      });
      
      it('should yield error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal('Missing required request parameters');
        expect(err.code).to.equal(40001);
        expect(err.messageDetail).to.equal('factor');
      });
      
    }); // failure caused by bad request
  
  }); // verify
  
});
