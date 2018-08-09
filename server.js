require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var session = require("express-session");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;

var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);

  // done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  done(null, id);
  // db.User.findById(id, function(err, user) {
  //   done(err, user);
  // });
});

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);-
app.set("view engine", "handlebars");

// passport.use(new FacebookStrategy({
//   clientID: "2056252867730586",
//   clientSecret: "79a270dbe9e819e9ca5b6acd12560bb6",
//   callbackURL: "http://localhost:3000/auth/facebook/callback"
// },-
// function(accessToken, refreshToken, profile, done) {
//   User.findOrCreate(function(err, user) {
//     if (err) { return done(err); }
//     done(null, user);
//   });
// }
// ));

passport.use(new GoogleStrategy({
  clientID: "183206309241-cd7t2vicllej2vf7kfes24nvbqg9pha4.apps.googleusercontent.com",
  clientSecret: "foP2XosB6isL5uqiWXP30SQD",
  callbackURL: "http://localhost:3000/auth/google/callback"
}
,
function(accessToken, refreshToken, profile, done) {

    db.User.findCreateFind({
      where: {
        email: profile.id,
        googleId: profile.id,
        password: profile.id
      }
    }).then(function (user) {
         done(null, user);
     }).catch(function (err) {
       done(err);
     });
}
));

passport.use(new LocalStrategy(
  // Our user will sign in using an email, rather than a "username"
  {
    usernameField: "email"
  },
  function(email, password, done) {
    // When a user tries to sign in this code runs
    db.User.findOne({
      where: {
        email: email
      }
    }).then(function(dbUser) {
      // If there's no user with the given email
      if (!dbUser) {
        return done(null, false, {
          message: "Incorrect email."
        });
      }
      // If there is a user with the given email, but the password the user gives us is incorrect
      else if (!dbUser.validPassword(password)) {
        return done(null, false, {
          message: "Incorrect password."
        });
      }
      // If none of the above, return the user
      return done(null, dbUser);
    });
  }
));

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
