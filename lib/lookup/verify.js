var merge = require('utils-merge');
var DuoAuthAPIError = require('../../lib/errors/duoauthapierror');


exports = module.exports = function(client) {
  
  return function verify(authenticator, secret, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
    console.log('VERIFY RECOVERY CODE');
    
    
    var params = {};
    merge(params, authenticator._user);
    params.factor = 'passcode';
    params.passcode = secret;
  
    client.jsonApiCall('POST', '/auth/v2/auth', params, function(data) {
      console.log('GOT LOOKUP SECRET DATA');
      console.log(data);
      
      if (data.stat !== 'OK') {
        return cb(new DuoAuthAPIError(data.message, data.code, data.message_detail));
      }
    
      switch (data.response.result) {
      case 'deny':
        return cb(null, false);
        break;
      case 'allow':
        return cb(null, true);
        break;
      }
    });
  };
};

exports['@implements'] = [
  'http://schemas.authnomicon.org/js/login/mfa/lookup/verify',
  'http://schemas.authnomicon.org/js/login/mfa/opt/duo/lookup/verify'
];
exports['@singleton'] = true;
exports['@require'] = [
  'http://schemas.authnomicon.org/js/login/mfa/opt/duo/Client'
];
