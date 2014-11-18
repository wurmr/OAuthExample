'use strict';

var saml = require('saml20');

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

    saml.parse(token, function(err, profile) {
      if (err) {
        res.send(403, { message: err.message });
        return;
      }

      req.user = profile.claims;
      next();
    });

    /** Validation Code, Works if certs are signed correctly */
    /**
    var options = {
      //thumbprint: '3648D5858403AD0094D8EC051F0497A3'
      //publicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0sjIJw7Drb7ra0HTWE7N/MBGfMN/AzULjg+rQwib7RjKozxvFq97MJPPsRUDLsd9l4of8oivGYKtnnO1Mp1TDGtLqTnuQMe0PM+4dariXsk+UK1TPSHFoxsAV1BLRCJHOqOfnuirML6TLx7H9n7GwmymSJRuG9ty9BYC/V4OfIkAJXA3JF1uXFzX3ElueLCr4FroEh11ZfVI4CLAWl3jQx1fmkqC8Fufn9sKV3ui8RBA1RirK4R4XB/gUyDQ/nIZnpnMv46F312OUjcMgRg8pCkkc/ww7YMENwVCRPfKxx7IJ2wkMxwpU8MiLCiJJasU/rDknAiRsk+Ndw4TcXVU1wIDAQAB'
      //audince: 'https://localhost:3000'
    };

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
*/

  }
};
