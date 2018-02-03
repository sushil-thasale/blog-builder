module.exports = function(app, userModel) {

  // Encrypt Passwords
  var bcrypt = require("bcrypt-nodejs");

  // Configure and Initialize Passport and Passport Session Support
  var passport = require('passport');

  // Configure Passport User Serialization and Deserialization
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);

  var facebookConfig = {
    // clientID     : process.env.FACEBOOK_CLIENT_ID,
    // clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
    // callbackURL  : process.env.FACEBOOK_CALLBACK_URL

    clientID: '164490714296594',
    clientSecret: 'ca90345ac27cb8a6b51e50330dcb5b68',
    callbackURL:'http://localhost:3100/auth/facebook/callback'
  };

  var githubConfig = {
    clientID: 'b69046c7637a8fd8a9d6',
    clientSecret: 'ab465fdc455abe8d69beb4d31cabe9462400f7e5',
    callbackURL:'http://localhost:3100/auth/github/callback'
  };

  // var linkedInConfig = {
  //   clientID: '78pdk9jrxab12s',
  //   clientSecret: 'uPhWHfCTgNExJcIB',
  //   callbackURL:'http://localhost:3100/auth/linkedin/callback'
  // };

  // var googleConfig = {
  //   clientID: 'b69046c7637a8fd8a9d6',
  //   clientSecret: 'ab465fdc455abe8d69beb4d31cabe9462400f7e5',
  //   callbackURL:'http://localhost:3100/auth/github/callback'
  // };

  // var twitterConfig = {
  //   clientID: 'b69046c7637a8fd8a9d6',
  //   clientSecret: 'ab465fdc455abe8d69beb4d31cabe9462400f7e5',
  //   callbackURL:'http://localhost:3100/auth/github/callback'
  // };


  // Implement Passport Local Strategy
  var LocalStrategy = require('passport-local').Strategy;
  passport.use(new LocalStrategy(localStrategy));

  // Implement PassportJS Facebook Strategy
  var FacebookStrategy = require('passport-facebook').Strategy;
  passport.use(new FacebookStrategy(facebookConfig, authStrategy));

  // Implement PassportJS Github Strategy
  var GitHubStrategy = require('passport-github2').Strategy;
  passport.use(new GitHubStrategy(githubConfig, authStrategy));

  // Implement PassportJS LinkedIn Strategy
  // var LinkedInStrategy = require('passport-linkedin').Strategy;
  // passport.use(new LinkedInStrategy(linkedInConfig, authStrategy));


  app.post("/api/user", createUser);
  app.get("/api/user", findUser);
  app.get("/api/user/:userId", findUserById);
  app.put("/api/user/:userId", updateUser);
  app.delete("/api/user/:userId", deleteUser);
  app.post('/api/login', passport.authenticate('local'), login);
  app.post('/api/logout', logout);
  app.post('/api/register', register);
  app.post('/api/loggedIn', loggedIn);

  // route for facebook authentication and login
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'user:email' ] }));
  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      var url = "http://localhost:4200/user/" + req.user._id.toString();
      res.redirect(url);
    });

  // GitHub
  app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));
  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
      var url = "http://localhost:4200/user/" + req.user._id.toString();
      res.redirect(url);
    });

  // LinkedIn
  // app.get('/auth/linkedin', passport.authenticate('linkedin', { scope: [ 'user:email' ] }));
  // app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }),
  //   function(req, res) {
  //     var url = "http://localhost:4200/user/" + req.user._id.toString();
  //     res.redirect(url);
  //   });

  function createUser(req, res){
    var newUser = req.body;

    userModel
      .createUser(newUser)
      .then(function(user) {
        res.json(user);
      }, function (error) {
        res.sendStatus(500).send(error);
      });
  }

  function findUser(req, res) {
    var username = req.query.username;
    var password = req.query.password;

    if (username && password) {
      findUserByCredentials(req, res);
    } else if (username) {
      findUserByUsername(req, res);
    }
  }

  function findUserByUsername(req, res) {

    var username = req.query.username;

    userModel
      .findUserByUsername(username)
      .then(function (users) {
        if(users.length != 0){
          res.json(users[0]);
        }
        else{
          res.sendStatus(404);
        }
      },function (err) {
        res.sendStatus(404);
      });
  }

  function findUserByCredentials(req, res) {
    var username = req.query.username;
    var password = req.query.password;

    userModel
      .findUserByCredentials(username, password)
      .then(function(user){
        res.json(user[0]);
      });
  }

  function findUserById(req, res) {
    var userId = req.params.userId;

    userModel
      .findUserById(userId)
      .then(function(user){
        res.json(user);
      });
  }

  function updateUser(req, res) {
    var userId = req.params.userId;
    var newUser = req.body;

    userModel
      .updateUser(userId, newUser)
      .then(function(user) {
          res.json(user);
        },
        function (error) {
          res.sendStatus(404).send(error);

        })
  }

  function deleteUser(req, res) {
    var userId = req.params.userId;

    userModel
      .deleteUser(userId)
      .then(function (response) {
        res.sendStatus(200);
      },function (err) {
        res.sendStatus(404);
      });
  }

  function serializeUser(user, done) {
    done(null, user);
  }

  function deserializeUser(user, done) {
    userModel
      .findUserById(user._id)
      .then(
        function(user){
          done(null, user);
        },
        function(err){
          done(err, null);
        }
      );
  }

  function localStrategy(username, password, done) {
    userModel
      .findUserByUsername(username)
      .then(function(user){
          if(user && bcrypt.compareSync(password, user[0].password)){
            return done(null, user[0]);
          }
          return done(null, false);
        },
        function(err) {
          if (err) { return done(err); }
        })
  }

  function login(req, res) {
    var user = req.user;
    res.json(user);
  }

  function logout(req, res) {
    req.logout();
    res.sendStatus(200);
  }

  function register (req, res) {
    var user = req.body;
    // Encrypt Passwords on Registration
    user.password = bcrypt.hashSync(user.password);
    // return userModel.createUser(user);

    userModel
      .createUser(user)
      .then(
        function(user){
          if(user){
            req.login(user, function(err) {
              if(err) {
                res.status(400).send(err);
              } else {
                res.json(user);
              }
            });
          }
        }
      );
  }

  function loggedIn(req, res) {
    if(req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.send('0');
    }
  }

  function authStrategy(accessToken, refreshToken, profile, done) {
    userModel
      .findUserByFacebookId(profile.id)
      .then(function(user) {
          if(user) {
            return done(null, user);
          }
          else {
            var names = profile.displayName.split(" ");
            console.log("names " + names);
            console.log("names " + profile.emails);
            var newFacebookUser = {
              firstName:  names[0],
              lastName:  names[1],
              facebook: {
                id:    profile.id,
                token: accessToken
              },
              email: profile.emails[0].value,
              username: profile.emails[0].value
            };

            userModel
              .createUser(newFacebookUser)
              .then(function (user) {
                console.log("new user created!");
                return done(null, user);
              });
          }
        },
        function(err) {
          if (err) { return done(err); }
        });
  }
}
