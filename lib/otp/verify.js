var merge = require('utils-merge');
var DuoAuthAPIError = require('../errors/duoauthapierror');


exports = module.exports = function(client, idmap) {
  
  return function verify(user, credID, otp, options, cb) {
    console.log('DUO VERIFY OTP!');
    console.log(otp);
    
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
        console.log('OTP VERIFY!');
        console.log(data);
        return;
      
        if (data.stat !== 'OK') {
          return cb(new DuoAuthAPIError(data.message, data.code, data.message_detail));
        }
      
        switch (data.response.result) {
        case 'waiting':
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
