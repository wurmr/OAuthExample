var express = require('express');
var router = express.Router();
var authentication = require('../authentication');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/me', authentication.ensureAuthenticated, function(req, res) {
  res.send(req.user._json);
});

module.exports = router;