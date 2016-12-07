exports = module.exports = function() {
  var duo = require('duo_web');
  
  
  var I_KEY = process.env['DUO_IKEY'];
  var S_KEY = process.env['DUO_SKEY'];
  var A_KEY = process.env['DUO_AKEY'];
  
  
  function verify(req, res, next) {
    console.log('VERIFY:')
    console.log(req.body);
    
    var username = duo.verify_response(I_KEY, S_KEY, A_KEY, req.body.sig_response);
    console.log(username);
  }


  return [
    require('body-parser').urlencoded({ extended: false }),
    verify
  ];
  
};

exports['@require'] = [];
