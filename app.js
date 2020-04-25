// require jsons packages
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcryot = require('bcrypt');
// set json packages
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
//set express to read css on public folder
app.use(express.static('public'));
// set mongoose connection for DB
mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
// encrypting passwords with env

const User = new mongoose.model('user', userSchema);
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
//callback register route
app.post('/register', function (req, res) {
  //requesting data from route "form"
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });
  // save requested data into DB
  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render('secrets');
    }
  });
});
//callback login route
app.post('/login', function (req, res) {
  const username = req.body.username;
  const password = md5(req.body.password);
  //fetch username and password form DB to authenticate
  User.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render('secrets');
        }
      }
    }
  });
});

// set port
app.listen(3000, function () {
  console.log('server started on port 3000');
});
