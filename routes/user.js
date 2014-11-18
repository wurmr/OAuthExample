var express = require('express');
var router = express.Router();
var authentication = require('../authentication');
var passport = require('passport');
var saml = require('saml20');

router.get('/me', passport.authenticate('google-token', {
  session: false
}), function(req, res) {
  res.send(req.user);
});

router.post('/me/saml', authentication.ensureSaml2, function(req, res) {
  res.send(req.user);
});

module.exports = router;