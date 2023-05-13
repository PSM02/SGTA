var express = require('express');
var router = express.Router();
const mongojs = require('mongojs')
const db = mongojs('mongodb://127.0.0.1:27017/SGTA', ['Users'])
var html = {}
/* GET home page. */
router.get('/', function(req, res, next) {
  uname=""
  if(req.session.user) {
    uname = `Kaixo ${req.session.user}!`
    html.login_logout = "<a href='/logout'>Log Out</a>";
  } else {
    html.login_logout = "<a href='/login'>Log In</a>";
    html.login_logout += "&nbsp; &nbsp; <a href='/signup'>Sign Up</a>";
  }
  console.log(html.login_logout);
  res.render('Menu' , { html: html, uname:uname, error: '' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { error: "" });
});

router.post("/login", function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var error = "";
  db.Users.findOne({Name: username, Password: password}, function(err, user) {
    if(err) {
      console.log(err);
      error = "Datu basean errorea";
      res.render('login', { title: 'Express', error: error });
    } else {
      if(user) {
        req.session.user = user.Name;
        res.redirect("/");
      } else {
        error = "Erabiltzaile edo pasahitz okerrak!";
        res.render('login', { error: error });
      }
    }
  }
  );
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { error: "" });
});

router.post("/signup", function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  var error = "";
  if(password != password2) {
    error = "Pasahitzak ez dira berdinak";
    res.render('signup', { error: error });
  } else {
    db.Users.findOne({Name: username}, function(err, user) {
      if(err) {
        console.log(err);
        error = "Datu basean errorea";
        res.render('signup', { error: error });
      } else {
        if(user) {
          error = "Erabiltzaile izena jadanik existitzen da";
          res.render('signup', { error: error });
        } else {
          db.Users.insert({Name: username, Password: password}, function(err, user) {
            if(err) {
              console.log(err);
              error = "Datu basean errorea";
              res.render('signup', { error: error });
            } else {
              req.session.user = user.Name;
              res.redirect("/");
            }
          });
        }
      }
    });
  }
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
