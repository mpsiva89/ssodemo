/**
 * Copyright (c) Microsoft Corporation
 *  All Rights Reserved
 *  Apache License 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @flow
 */

'use strict';

/**
 * Module dependencies.
 */

var express = require('express');
var passport = require('passport');
var util = require('util');
var bunyan = require('bunyan');
var appRoutes = require('./routes');
var utils = require('./lib/utils');
var googleAuthenticator = require('./lib/google_authenticator');

var log = bunyan.createLogger({
    name: 'SSODemo With Google OAuth'
});

passport.serializeUser(function(user, done) {
  done(null, user.email);
});

passport.deserializeUser(function(id, done) {
  utils.findByEmail(id, function (err, user) {
    done(err, user);
  });
});

googleAuthenticator.Strategy(passport);

var app = express();


app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'keyboard cat', resave: true, saveUninitialized: false }));
  app.use(express.bodyParser());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/../../public'));
});

appRoutes.add_to_app(app, passport, log);

app.listen(3000);
