var router = require('express').Router();
var jwt = require('jwt-simple');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'Express'
  });
});

// Route to encode base64 string for testing purposes, use this to encode your SAML token
router.post('/encode', function(req, res) {
  var samlToken = new Buffer(req.body).toString('base64');

  res.send({
    base64: samlToken,
    jwt: jwt.encode({
      token: samlToken
    }, 'phantom dog')
  });
});

module.exports = router;
