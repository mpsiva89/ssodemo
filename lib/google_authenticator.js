var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var utils = require('./utils');

exports.Strategy = function(passport) {
  passport.use("ssodemo_google_oauth", new GoogleStrategy({
    clientID: "825055227715-m22b2guut216rvod8md2s816udhbcvmr.apps.googleusercontent.com",
    clientSecret: "XOfVb5UupSmuie7BCZUbie0P",
    callbackURL: "http://nittdemo.dev:3000/oauth/callback",
    passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
      profile.email = profile["_json"]["email"];
      if (!profile.email) {
        return done(new Error("No email found"), null);
      }
      process.nextTick(function () {
        utils.findByEmail(profile.email, function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            utils.users.push(profile);
            return done(null, profile);
          }
          return done(null, user);
        });
      });
    }
  ));
};