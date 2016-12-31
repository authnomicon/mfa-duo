/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../lib/otp/verify');


describe('otp/verify', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.have.length(2);
    expect(factory['@implements'][0]).to.equal('http://schemas.authnomicon.org/js/login/mfa/otp/verify');
    expect(factory['@implements'][1]).to.equal('http://schemas.authnomicon.org/js/login/mfa/opt/duo/otp/verify');
    expect(factory['@singleton']).to.equal(true);
  });
  
  describe('verify', function() {
    var client = {
      jsonApiCall: function(){}
    };
    var idmap;
  
    
    describe('a valid passcode', function() {
      var ok;
      
      before(function() {
        var result = {
          response: {
            result: 'allow',
            status: 'allow',
            status_msg: 'Success. Logging you in...'
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
        var verify = factory(idmap, client);
        verify({ id: '1', username: 'johndoe' }, 'XXXXXXXXXXX000X0XXXX', '123456', function(_err, _ok) {
          if (_err) { return done(_err); }
          ok = _ok;
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
          factor: 'passcode',
          passcode: '123456'
        });
      });
      
      it('should yield ok', function() {
        expect(ok).to.be.true;
      });
    }); // a valid token
    
    describe('an invalid passcode', function() {
      var ok;
      
      before(function() {
        var result = {
          response: {
            result: 'deny',
            status: 'deny',
            status_msg: 'Incorrect passcode. Please try again.'
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
        var verify = factory(idmap, client);
        verify({ id: '1', username: 'johndoe' }, 'XXXXXXXXXXX000X0XXXX', '123456', function(_err, _ok) {
          if (_err) { return done(_err); }
          ok = _ok;
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
          factor: 'passcode',
          passcode: '123456'
        });
      });
      
      it('should yield ok', function() {
        expect(ok).to.be.false;
      });
      
    }); // an invalid token
  
  }); // verify
  
});
