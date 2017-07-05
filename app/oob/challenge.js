var qs = require('qs');
var merge = require('utils-merge');
var DuoAuthAPIError = require('../../lib/errors/duoauthapierror');


exports = module.exports = function(client) {
  
  return function challenge(authenticator, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
    var type = options.type || 'oob'
      , channel = options.channel;
      //var type = options.type || 'otp';
    
      
      /*
      var opts = {
        async: true,
        username: 'johndoe',
        factor: 'push',
        //factor: 'passcode',
        //factor: 'sms',
        //factor: 'phone', // causes call with "press any key to authenticate" message, needs async txnid for status
        device: 'XXXXXX'
      }
      */
      
      // TO CHECK A OTP CODE
      /*
      var opts = {
        username: 'johndoe',
        factor: 'passcode',
        passcode: '1955600'
      }
      */
      
    var params = {};
    merge(params, authenticator._user);
    params.device = authenticator._id;
    
    
    switch (type) {
      case 'oob': {
        params.async = '1';
        
        switch (channel) {
        case 'pns':
          params.factor = 'push';
          //params.type = 'Transfer';
          break;
        case 'tel':
          params.factor = 'phone';
          break;
        case undefined:
          params.factor = 'auto';
          //params.type = 'Transfer';
          //params.pushinfo = qs.stringify({ amount: '10,000', scope: 'write' })
          break;
        }
      }
      break;
      
      case 'otp': {
        // TODO:
        return cb();
      }
      break;
      
      // TODO: default error
    }
  
    client.jsonApiCall('POST', '/auth/v2/auth', params, function(data) {
      if (data.stat !== 'OK') {
        return cb(new DuoAuthAPIError(data.message, data.code, data.message_detail));
      }
      
      console.log('CHALLENGE DUO');
      console.log(data);
      
      return cb(null, { type: 'oob', transactionID: data.response.txid });
    });
  };
};

exports['@implements'] = [
  'http://schemas.authnomicon.org/js/login/mfa/challenge',
  'http://schemas.authnomicon.org/js/login/mfa/opt/duo/challenge'
];
exports['@singleton'] = true;
exports['@require'] = [
  'http://schemas.authnomicon.org/js/login/mfa/opt/duo/Client'
];
