exports = module.exports = function(associate, challenge, verify) {
  
  return {
    associate: associate,
    challenge: challenge,
    verify: verify
  };
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/security/authentication/oob/Channel';
exports['@channel'] = 'duo';

exports['@singleton'] = true;
exports['@require'] = [
  './associate',
  './challenge',
  './verify'
];
