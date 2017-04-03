
exports.add_to_app = function(app, passport, log) {
  app.get('/', function(req, res){
    res.render('index', { user: req.user });
  });  

  app.get('/login',
    passport.authenticate('ssodemo_google_oauth', { 
      scope: ["https://www.googleapis.com/auth/userinfo.profile", 
        "https://www.googleapis.com/auth/userinfo.email"], 
      failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
  });


  app.get('/oauth/callback',
    passport.authenticate('ssodemo_google_oauth', { failureRedirect: '/login' }),
    function(req, res) {
      log.info('Recieved return from Google');
      res.redirect('/');
  });

  app.get('/account', ensureAuthenticated, function(req, res){
    res.render('account', { user: req.user });
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
};

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
};
