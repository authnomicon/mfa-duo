exports = module.exports = function() {
  var duo = require('duo_web');
  
  
  var I_KEY = process.env['DUO_IKEY'];
  var S_KEY = process.env['DUO_SKEY'];
  var A_KEY = process.env['DUO_AKEY'];
  
  
  function prompt(req, res, next) {
    //res.locals.state = req.query.state;
    
    var sigRequest = duo.sign_request(I_KEY, S_KEY, A_KEY, 'johndoe');
    
    res.locals.host = 'api-a0fdfa58.duosecurity.com';
    res.locals.sigRequest = sigRequest;
    
    res.render('mfa-duo');
  }


  return [
    prompt
  ];
  
};

exports['@require'] = [];
