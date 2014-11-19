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

    /** Validation Code, This verifies the assertion is legit */
    var options = {
      thumbprint: '283db4bd92c84fc2b4ca7aead347850aefd1bf82',
      //publicKey: 'MIIC4DCCAcigAwIBAgIQSIBI0oWWDLVFDbTfNy0PiDANBgkqhkiG9w0BAQsFADAsMSowKAYDVQQDEyFBREZTIFNpZ25pbmcgLSBhZGZzLmludGVydGVjaC5jb20wHhcNMTQxMDMwMTkyMTQyWhcNMTUxMDMwMTkyMTQyWjAsMSowKAYDVQQDEyFBREZTIFNpZ25pbmcgLSBhZGZzLmludGVydGVjaC5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDSyMgnDsOtvutrQdNYTs38wEZ8w38DNQuOD6tDCJvtGMqjPG8Wr3swk8+xFQMux32Xih/yiK8Zgq2ec7UynVMMa0upOe5Ax7Q8z7h1quJeyT5QrVM9IcWjGwBXUEtEIkc6o5+e6KswvpMvHsf2fsbCbKZIlG4b23L0FgL9Xg58iQAlcDckXW5cXNfcSW54sKvgWugSHXVl9UjgIsBaXeNDHV+aSoLwW5+f2wpXe6LxEEDVGKsrhHhcH+BTIND+chmemcy/joXfXY5SNwyBGDykKSRz/DDtgwQ3BUJE98rHHsgnbCQzHClTwyIsKIklqxT+sOScCJGyT413DhNxdVTXAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAC/ryI8rBB15Acb4uHq4piXHhRZHP+6pwtM1KYtod1oewI4yedFamgRqLFUn0wyPz5INd0qcqg45OVSYDt+kDkZki/bXeY0Fq4BG87LBmvoxda0FifdBO/g2xq6ajnObXnercEu+2y517dfUQumTMoSo74vV+f6pGSXxxebsvZTRPqN6BWYamx/zmrwW51l8QAH4bjKqdzgIT+/L9UJsU6fqrVJFUMbVyojcrmlVNZWxYchBcVxCDOJqV4OCugqOXgxepPjyvoZPmqXTL0OftLTF1BYWCG+jlpFaeVxL29maCg+sh4jWgK6jRsuUbVDwWOPoJDHTbWvmZ+GWGtKKyzg='
      audience: 'https://localhost:3000/'
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
  }
};