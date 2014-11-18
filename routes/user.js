var router = require('express').Router();
var authentication = require('../authentication');
var passport = require('passport');

router.get('/me', passport.authenticate('google-token', {
  session: false
}), function(req, res) {
  res.send(req.user);
});

router.get('/me/saml', authentication.ensureSaml2, function(req, res) {
  res.send(req.user);
});

module.exports = router;
