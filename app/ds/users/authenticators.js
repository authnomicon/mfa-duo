var merge = require('utils-merge');


function UserAuthenticatorsDirectory(client, idmap) {
  this._client = client;
  this._idmap = idmap;
}

UserAuthenticatorsDirectory.prototype.list = function(user, options, cb) {
  if (typeof options == 'function') {
    cb = options;
    options = undefined;
  }
  options = options || {};
  
  var self = this;
  this._idmap(user, function(err, idparams) {
    if (err) { return cb(err); }
    
    var params = {};
    merge(params, idparams);
    
    self._client.jsonApiCall('POST', '/auth/v2/preauth', params, function(data) {
      if (data.stat !== 'OK') {
        return cb(new Error('TODO: something went wrong'));
      }
      
      if (data.response.result == 'enroll') {
        return cb(null);
      }
      
    
      var devices = data.response.devices, device;
      var authenticators = [], authenticator;
      var i, len;
    
      for (i = 0, len = devices.length; i < len; ++i) {
        device = devices[i];
        authenticator = {};
        authenticator.id = device.device;
        authenticator.type = [];
        //authenticator.keys = [];
        
        // https://tools.ietf.org/search/rfc6030
        //authenticator.manufacturer  // manufacturer
        // model = iOS
        // serialNo
        
        if (device.capabilities.indexOf('push') !== -1) {
          authenticator.type.push('oob');
        }
        if (device.capabilities.indexOf('mobile_otp') !== -1) {
          authenticator.type.push('otp');
          /*
          authenticator.keys.push({
            issuer: 'Duo Security, Inc', // ??
            type: 'oct', // symmetric ???
            algorithm: 'hotp', // ??
          });
          */
        }
        authenticator.type.push('lookup-secret');
        authenticator._id = device.device;
        authenticator._user = idparams;
        
        authenticators.push(authenticator);
      }
      
      return cb(null, authenticators);
    });
  });
};

UserAuthenticatorsDirectory.prototype.get = function(user, aid, cb) {
  this.list(user, function(err, authenticators) {
    if (err) { return cb(err); }
    
    var i, len;
    for (i = 0, len = authenticators.length; i < len; ++i) {
      if (authenticators[i].id == aid) {
        return cb(null, authenticators[i]);
      }
    }
    return cb(null);
  });
};



exports = module.exports = function(idmap, client) {
  var directory = new UserAuthenticatorsDirectory(client, idmap);
  return directory;
};

exports['@implements'] = [
  'http://schemas.authnomicon.org/js/login/mfa/UserAuthenticatorsDirectory',
  'http://schemas.authnomicon.org/js/login/mfa/opt/duo/UserAuthenticatorsDirectory'
];
exports['@singleton'] = true;
exports['@require'] = [
  '../../id/map', // TODO: Move this component to idm
  'http://schemas.authnomicon.org/js/login/mfa/opt/duo/Client'
];
