var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }));

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/google'
  }),
  function(req, res, next) {
    // Successful authentication, redirect home.
    res.redirect('/users/me');
    //return next();
  });

module.exports = router;