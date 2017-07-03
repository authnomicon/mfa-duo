exports = module.exports = function() {
  // Load modules.
  var duo = require('duo_api');
  
  // TODO: Wrap the duo module, allowing for user, domain related options to be passed.
  
  var I_KEY = process.env['DUO_IKEY'];
  var S_KEY = process.env['DUO_SKEY'];
  var HOST = process.env['DUO_HOST'];
  
  var client = new duo.Client(I_KEY, S_KEY, HOST)
  return client;
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/login/mfa/opt/duo/Client';
exports['@singleton'] = true;
exports['@require'] = [];
