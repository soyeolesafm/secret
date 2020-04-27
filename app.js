// require jsons packages
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
// set json packages
mongoose.set('useCreateIndex', true);
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
//set express to read css on public folder
app.use(express.static('public'));
// set session to have a "secret" in this area between mogoose connection and json packages
app.use(
  session({
    secret: 'Our little secret',
    resave: false,
    saveUninitialized: false,
  })
);
// initialized passport and use passport to manage our session
app.use(passport.initialize());
app.use(passport.session());
// set mongoose connection for DB
mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
// set user schema to use PassLoclMngse as a plugin
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('user', userSchema);
//use PassLlclMngse to create a local login strategy
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//TODO
// render home ejs
app.get('/', function (req, res) {
  res.render('home');
});
// render login eja
app.get('/login', function (req, res) {
  res.render('login');
});
//render register ejs
app.get('/register', function (req, res) {
  res.render('register');
});
app.get('/secrets', function (req, res) {
  if (req.isAuthenticated()) {
    res.render('secrets');
  } else {
    res.redirect('/login');
  }
});
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});
//callback register route
app.post('/register', function (req, res) {
  User.register({ username: req.body.username }, req.body.password, function (
    err,
    user
  ) {
    if (err) {
      console.log(err);
      res.redirect('/register');
    } else {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/secrets');
      });
    }
  });
});
//callback login route
app.post('/login', function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/secrets');
      });
    }
  });
});

// set port
app.listen(3000, function () {
  console.log('server started on port 3000');
});
