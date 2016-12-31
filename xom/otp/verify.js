var merge = require('utils-merge');
var DuoAuthAPIError = require('../../lib/errors/duoauthapierror');


exports = module.exports = function(idmap, client) {
  
  return function verify(user, credID, otp, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
    
    idmap(user, function(err, idparams) {
      if (err) { return cb(err); }
    
      var params = {};
      merge(params, idparams);
      params.factor = 'passcode';
      params.passcode = otp;
    
      client.jsonApiCall('POST', '/auth/v2/auth', params, function(data) {
        if (data.stat !== 'OK') {
          return cb(new DuoAuthAPIError(data.message, data.code, data.message_detail));
        }
      
        switch (data.response.result) {
        case 'waiting': // FIXME: This is not a valid status here, error on default case of no allow or deny
          return cb(null, undefined);
          break;
        case 'deny':
          return cb(null, false);
          break;
        case 'allow':
          return cb(null, true);
          break;
        }
      });
    });
  };
};

exports['@implements'] = [
  'http://schemas.authnomicon.org/js/login/mfa/otp/verify',
  'http://schemas.authnomicon.org/js/login/mfa/opt/duo/otp/verify'
];
exports['@singleton'] = true;
exports['@require'] = [
  '../id/map',
  'http://schemas.authnomicon.org/js/login/mfa/opt/duo/Client'
];
