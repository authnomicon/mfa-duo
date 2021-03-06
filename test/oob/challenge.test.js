/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../app/oob/challenge');


describe('challenge', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  describe('challenge', function() {
    var client = {
      jsonApiCall: function(){}
    };
  
  
    describe('a typical authenticator', function() {
      var transactionID;
      
      before(function() {
        var result = {
          response: {
            txid: '0a0zz000-aaaa-0aa0-a000-00a0aaa00a0a'
          },
          stat: 'OK'
        };
        
        sinon.stub(client, 'jsonApiCall').yields(result);
      });
    
      after(function() {
        client.jsonApiCall.restore();
      });
      
      before(function(done) {
        var challenge = factory(client);
        var authenticator = {
          id: 'XXXXXXXXXXX000X0XXXX',
          type: [ 'oob', 'otp' ],
          _id: 'XXXXXXXXXXX000X0XXXX',
          _user: { username: 'johndoe' }
        }
        
        challenge(authenticator, function(_err, _transactionID) {
          if (_err) { return done(_err); }
          transactionID = _transactionID;
          done();
        });
      });
    
      it('should perform authentication via Auth API', function() {
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
        expect(transactionID).to.equal('0a0zz000-aaaa-0aa0-a000-00a0aaa00a0a');
      });
    }); // a typical authenticator
    
    describe('an authenticator as out-of-band device', function() {
      var transactionID;
      
      before(function() {
        var result = {
          response: {
            txid: '0a0zz000-aaaa-0aa0-a000-00a0aaa00a0a'
          },
          stat: 'OK'
        };
        
        sinon.stub(client, 'jsonApiCall').yields(result);
      });
    
      after(function() {
        client.jsonApiCall.restore();
      });
      
      before(function(done) {
        var challenge = factory(client);
        var authenticator = {
          id: 'XXXXXXXXXXX000X0XXXX',
          type: [ 'oob', 'otp' ],
          _id: 'XXXXXXXXXXX000X0XXXX',
          _user: { username: 'johndoe' }
        }
        
        challenge(authenticator, { type: 'oob' }, function(_err, _transactionID) {
          if (_err) { return done(_err); }
          transactionID = _transactionID;
          done();
        });
      });
    
      it('should perform authentication via Auth API', function() {
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
        expect(transactionID).to.equal('0a0zz000-aaaa-0aa0-a000-00a0aaa00a0a');
      });
    }); // an authenticator as out-of-band device
    
    describe('an authenticator as out-of-band device via push notification service channel', function() {
      var transactionID;
      
      before(function() {
        var result = {
          response: {
            txid: '0a0zz000-aaaa-0aa0-a000-00a0aaa00a0a'
          },
          stat: 'OK'
        };
        
        sinon.stub(client, 'jsonApiCall').yields(result);
      });
    
      after(function() {
        client.jsonApiCall.restore();
      });
      
      before(function(done) {
        var challenge = factory(client);
        var authenticator = {
          id: 'XXXXXXXXXXX000X0XXXX',
          type: [ 'oob', 'otp' ],
          _id: 'XXXXXXXXXXX000X0XXXX',
          _user: { username: 'johndoe' }
        }
        
        challenge(authenticator, { type: 'oob', channel: 'pns' }, function(_err, _transactionID) {
          if (_err) { return done(_err); }
          transactionID = _transactionID;
          done();
        });
      });
    
      it('should perform authentication via Auth API', function() {
        expect(client.jsonApiCall).to.have.been.calledOnce;
        var call = client.jsonApiCall.getCall(0);
        expect(call.args[0]).to.equal('POST');
        expect(call.args[1]).to.equal('/auth/v2/auth');
        expect(call.args[2]).to.deep.equal({
          username: 'johndoe',
          device: 'XXXXXXXXXXX000X0XXXX',
          async: '1',
          factor: 'push'
        });
      });
      
      it('should yield parameters', function() {
        expect(transactionID).to.equal('0a0zz000-aaaa-0aa0-a000-00a0aaa00a0a');
      });
    }); // an authenticator as out-of-band device via push notification service channel
    
    describe('an authenticator as out-of-band device via telephone channel', function() {
      var transactionID;
      
      before(function() {
        var result = {
          response: {
            txid: '0a0zz000-aaaa-0aa0-a000-00a0aaa00a0a'
          },
          stat: 'OK'
        };
        
        sinon.stub(client, 'jsonApiCall').yields(result);
      });
    
      after(function() {
        client.jsonApiCall.restore();
      });
      
      before(function(done) {
        var challenge = factory(client);
        var authenticator = {
          id: 'XXXXXXXXXXX000X0XXXX',
          type: [ 'oob', 'otp' ],
          _id: 'XXXXXXXXXXX000X0XXXX',
          _user: { username: 'johndoe' }
        }
        
        challenge(authenticator, { type: 'oob', channel: 'tel' }, function(_err, _transactionID) {
          if (_err) { return done(_err); }
          transactionID = _transactionID;
          done();
        });
      });
    
      it('should perform authentication via Auth API', function() {
        expect(client.jsonApiCall).to.have.been.calledOnce;
        var call = client.jsonApiCall.getCall(0);
        expect(call.args[0]).to.equal('POST');
        expect(call.args[1]).to.equal('/auth/v2/auth');
        expect(call.args[2]).to.deep.equal({
          username: 'johndoe',
          device: 'XXXXXXXXXXX000X0XXXX',
          async: '1',
          factor: 'phone'
        });
      });
      
      it('should yield parameters', function() {
        expect(transactionID).to.equal('0a0zz000-aaaa-0aa0-a000-00a0aaa00a0a');
      });
    }); // an authenticator as out-of-band device via telephone channel
    
    describe('failure caused by bad request, missing required parameters', function() {
      var err, transactionID;
      
      before(function() {
        var result = {
          code: 40001,
          message: 'Missing required request parameters',
          message_detail: 'factor',
          stat: 'FAIL'
        };
        
        sinon.stub(client, 'jsonApiCall').yields(result);
      });
    
      after(function() {
        client.jsonApiCall.restore();
      });
      
      before(function(done) {
        var challenge = factory(client);
        var authenticator = {
          id: 'XXXXXXXXXXX000X0XXXX',
          type: [ 'oob', 'otp' ],
          _id: 'XXXXXXXXXXX000X0XXXX',
          _user: { username: 'johndoe' }
        }
        
        challenge(authenticator, function(_err, _transactionID) {
          err = _err;
          transactionID = _transactionID;
          done();
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
    }); // failure caused by bad request, missing required parameters
  
  }); // verify
  
});
