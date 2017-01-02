var merge = require('utils-merge');
var DuoAuthAPIError = require('../../lib/errors/duoauthapierror');


exports = module.exports = function(client) {
  
  return function verify(authenticator, otp, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
    
    var params = {};
    merge(params, authenticator._user);
    params.factor = 'passcode';
    params.passcode = otp;
  
    client.jsonApiCall('POST', '/auth/v2/auth', params, function(data) {
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
  'http://schemas.authnomicon.org/js/login/mfa/otp/verify',
  'http://schemas.authnomicon.org/js/login/mfa/opt/duo/otp/verify'
];
exports['@singleton'] = true;
exports['@require'] = [
  'http://schemas.authnomicon.org/js/login/mfa/opt/duo/Client'
];
