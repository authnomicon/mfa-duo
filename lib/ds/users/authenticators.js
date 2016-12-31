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
    
      var devices = data.response.devices, device;
      var credentials = [], credential;
      var i, len;
    
      for (i = 0, len = devices.length; i < len; ++i) {
        device = devices[i];
        credential = {};
        credential.id = device.device;
        credential.methods = [];
        if (device.capabilities.indexOf('mobile_otp') !== -1) {
          credential.methods.push('otp');
        }
        credential._id = device.device;
        credential._user = idparams;
        
        credentials.push(credential);
      }
      
      return cb(null, credentials);
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
  '../../id/map',
  'http://schemas.authnomicon.org/js/login/mfa/opt/duo/Client'
];
