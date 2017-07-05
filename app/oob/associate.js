var qs = require('qs');
var merge = require('utils-merge');
var DuoAuthAPIError = require('../../lib/errors/duoauthapierror');


exports = module.exports = function(idmap, client) {
  
  return function register(user, cb) {
    console.log('REGISTER DUO...');
    
    idmap(user, function(err, idparams) {
      
      var params = {};
      //merge(params, idparams);
      // TODO: Might want to do `idnew` because of this
      // NOTE: Error if username already exists
      //params.username = 'enrollme';
    
      client.jsonApiCall('POST', '/auth/v2/enroll', params, function(data) {
        if (data.stat !== 'OK') {
          return cb(new DuoAuthAPIError(data.message, data.code, data.message_detail));
        }
      
        // NOTE: `activation_barcode` in the response is an HTTP URL that responds
        //       with a QR Code image, which encodes the `activation_code` as data.
        var params = {
          type: 'oob',
          barcodeURL: data.response.activation_code,
          providedID: data.response.user_id,
          transactionID: data.response.activation_code
        }
        return cb(null, params);
      });
    });
  };
};

exports['@require'] = [
  '../id/map',
  'http://schemas.authnomicon.org/js/login/mfa/opt/duo/Client'
];
