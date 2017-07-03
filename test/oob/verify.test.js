/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../app/oob/verify');


describe('oob/verify', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.have.length(2);
    expect(factory['@implements'][0]).to.equal('http://schemas.authnomicon.org/js/login/mfa/oob/verify');
    expect(factory['@implements'][1]).to.equal('http://schemas.authnomicon.org/js/login/mfa/opt/duo/oob/verify');
    expect(factory['@singleton']).to.equal(true);
  });
  
  describe('verify', function() {
    var client = {
      jsonApiCall: function(){}
    };
    
    
    describe('approved response to Duo Push', function() {
      var ok, params;
      
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
      });
    
      after(function() {
        client.jsonApiCall.restore();
      });
      
      before(function(done) {
        var verify = factory(client);
        var authenticator = {
          id: 'XXXXXXXXXXX000X0XXXX',
          type: [ 'oob', 'otp' ],
          _id: 'XXXXXXXXXXX000X0XXXX',
          _user: { username: 'johndoe' }
        }
        var opts = {
          context: {
            transactionID: '0a0zz000-aaaa-0aa0-a000-00a0aaa00a0a'
          }
        }
        
        verify(authenticator, '0a0zz000-aaaa-0aa0-a000-00a0aaa00a0a', opts, function(_err, _ok, _params) {
          if (_err) { return done(_err); }
          ok = _ok;
          params = _params;
          done();
        });
      });
    
      it('should check status of authentication process via Auth API', function() {
        expect(client.jsonApiCall).to.have.been.calledOnce;
        var call = client.jsonApiCall.getCall(0);
        expect(call.args[0]).to.equal('GET');
        expect(call.args[1]).to.equal('/auth/v2/auth_status');
        expect(call.args[2]).to.deep.equal({
          txid: '0a0zz000-aaaa-0aa0-a000-00a0aaa00a0a'
        });
      });
      
      it('should yield ok', function() {
        expect(ok).to.be.true;
      });
    }); // approved response to Duo Push
    
    describe('denied response to Duo Push', function() {
      var ok, params;
      
      before(function() {
        var result = {
          response: {
            result: 'deny',
            status: 'deny',
            status_msg: 'Login request denied.'
          },
          stat: 'OK'
        };
        
        sinon.stub(client, 'jsonApiCall').yields(result);
      });
    
      after(function() {
        client.jsonApiCall.restore();
      });
      
      before(function(done) {
        var verify = factory(client);
        var authenticator = {
          id: 'XXXXXXXXXXX000X0XXXX',
          type: [ 'oob', 'otp' ],
          _id: 'XXXXXXXXXXX000X0XXXX',
          _user: { username: 'johndoe' }
        }
        var opts = {
          context: {
            transactionID: '0a0zz000-aaaa-0aa0-a000-00a0aaa00a0a'
          }
        }
        
        verify(authenticator, '0a0zz000-aaaa-0aa0-a000-00a0aaa00a0a', opts, function(_err, _ok, _params) {
          if (_err) { return done(_err); }
          ok = _ok;
          params = _params;
          done();
        });
      });
    
      it('should check status of authentication process via Auth API', function() {
        expect(client.jsonApiCall).to.have.been.calledOnce;
        var call = client.jsonApiCall.getCall(0);
        expect(call.args[0]).to.equal('GET');
        expect(call.args[1]).to.equal('/auth/v2/auth_status');
        expect(call.args[2]).to.deep.equal({
          txid: '0a0zz000-aaaa-0aa0-a000-00a0aaa00a0a'
        });
      });
      
      it('should yield ok', function() {
        expect(ok).to.be.false;
      });
    }); // denied response to Duo Push
  
    describe('pending response to Duo Push', function() {
      var ok, params;
      
      before(function() {
        var result = {
          response: {
            result: 'waiting',
            status: 'pushed',
            status_msg: 'Pushed a login request to your device...'
          },
          stat: 'OK'
        };
        
        sinon.stub(client, 'jsonApiCall').yields(result);
      });
    
      after(function() {
        client.jsonApiCall.restore();
      });
      
      before(function(done) {
        var verify = factory(client);
        var authenticator = {
          id: 'XXXXXXXXXXX000X0XXXX',
          type: [ 'oob', 'otp' ],
          _id: 'XXXXXXXXXXX000X0XXXX',
          _user: { username: 'johndoe' }
        }
        var opts = {
          context: {
            transactionID: '0a0zz000-aaaa-0aa0-a000-00a0aaa00a0a'
          }
        }
        
        verify(authenticator, '0a0zz000-aaaa-0aa0-a000-00a0aaa00a0a', opts, function(_err, _ok, _params) {
          if (_err) { return done(_err); }
          ok = _ok;
          params = _params;
          done();
        });
      });
    
      it('should check status of authentication process via Auth API', function() {
        expect(client.jsonApiCall).to.have.been.calledOnce;
        var call = client.jsonApiCall.getCall(0);
        expect(call.args[0]).to.equal('GET');
        expect(call.args[1]).to.equal('/auth/v2/auth_status');
        expect(call.args[2]).to.deep.equal({
          txid: '0a0zz000-aaaa-0aa0-a000-00a0aaa00a0a'
        });
      });
      
      it('should yield indeterminate ok', function() {
        expect(ok).to.be.undefined;
      });
    }); // pending response to Duo Push
  
    describe('failure caused by bad request, method not allowed', function() {
      var err, ok;
      
      before(function() {
        var result = { code: 40501, message: 'Method not allowed', stat: 'FAIL' };
        
        sinon.stub(client, 'jsonApiCall').yields(result);
      });
    
      after(function() {
        client.jsonApiCall.restore();
      });
      
      before(function(done) {
        var verify = factory(client);
        var authenticator = {
          id: 'XXXXXXXXXXX000X0XXXX',
          type: [ 'oob', 'otp' ],
          _id: 'XXXXXXXXXXX000X0XXXX',
          _user: { username: 'johndoe' }
        }
        var opts = {
          context: {
            transactionID: '0a0zz000-aaaa-0aa0-a000-00a0aaa00a0a'
          }
        }
        
        verify(authenticator, '0a0zz000-aaaa-0aa0-a000-00a0aaa00a0a', opts, function(_err, _ok) {
          err = _err;
          ok = _ok;
          done();
        });
      });
    
      it('should call client#jsonApiCall', function() {
        expect(client.jsonApiCall).to.have.been.calledOnce;
        var call = client.jsonApiCall.getCall(0);
        expect(call.args[0]).to.equal('GET');
        expect(call.args[1]).to.equal('/auth/v2/auth_status');
        expect(call.args[2]).to.deep.equal({
          txid: '0a0zz000-aaaa-0aa0-a000-00a0aaa00a0a'
        });
      });
      
      it('should yield error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal('Method not allowed');
        expect(err.code).to.equal(40501);
        expect(err.messageDetail).to.be.undefined;
      });
    }); // failure caused by bad request, method not allowed
  
  }); // verify
  
});
