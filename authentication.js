'use strict';

var saml = require('saml20'),
  config = require('config');


module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.send(401);
  },

  ensureSaml2: function(req, res, next) {
    var authHeader = req.headers.authorization;

    if (!authHeader || authHeader.indexOf('Bearer') == -1) {
      res.send(403, {
        message: "Please send me a token!"
      });
      return;
    };

    var token = (new Buffer(authHeader.slice('Bearer '.length, authHeader.length - 1), 'base64')).toString();

    if (!token) {
      res.send(403, {
        message: "Please send me a token!"
      });
      return
    };

    /** Validation Code, This verifies the assertion is legit */
    var options = config.get('samlSettings');

    saml.validate(token, options, function(err, profile) {
      if (err) {
        res.send(403, {
          message: err.message
        });
        return;
      }

      req.user = profile.claims;
      next();
    });
  }
};