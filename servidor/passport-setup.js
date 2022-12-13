const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function (user, done) {
  //console.log(user);
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  //User.findById(id, function(err, user) {
  done(null, user);
  //});
});

passport.use(new GoogleStrategy({
  clientID: "315617784860-hst8dft7s4c3r02qba7ujffbhrmivma8.apps.googleusercontent.com",
  clientSecret: "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", 
  callbackURL: "http://localhost:3000/google/callback"
},
  function (accessToken, refreshToken, profile, done) {
    //User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return done(null, profile);
    //});
  }
));
