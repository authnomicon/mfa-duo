exports = module.exports = function(idmap, client) {
  // Load modules.
  var Directory = require('../../lib/creds/directory');
  
  var directory = new Directory(client, idmap);
  return directory;
};

exports['@implements'] = [
  'http://schemas.authnomicon.org/js/login/mfa/CredentialDirectory',
  'http://schemas.authnomicon.org/js/login/mfa/opt/duo/CredentialDirectory'
];
exports['@singleton'] = true;
exports['@require'] = [
  '../id/map',
  'http://schemas.authnomicon.org/js/login/mfa/opt/duo/Client'
];
