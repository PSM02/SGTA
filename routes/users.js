var express = require('express');
var router = express.Router();
var html = {}
const mongojs = require('mongojs')
const db = mongojs('mongodb://127.0.0.1:27017/SGTA', ['Foods'])

router.get('*', function(req, res, next) {
    if(req.session.user) {
        next();
    } else {
        res.render("login" ,{ error: "Sesioa ireki behar duzu!" });
    }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    html.login_logout = "<a href='/logout'>Log Out</a>";
    db.Foods.find(function(err, foods) {
        if(err) {
            console.log(err);
            res.render('Foods', { html: html, error: err });
        } else {
            html.foods = foods;
            console.log(html.foods);
            res.render('Janaria' , { html: html, uname:`Kaixo ${req.session.user}!`, error: '',});
        }
    });
});

router.get('/jarraitu', function(req, res, next) {
    html.login_logout = "<a href='/logout'>Log Out</a>";
    res.render('CheckOut' , { html: html, uname:`Kaixo ${req.session.user}!`, error: ''});
});

router.post('/jarraitu', function(req, res, next) {
    html.login_logout = "<a href='/logout'>Log Out</a>";
    html.foods = req.body;
    res.render('CheckOut' , { html: html, uname:`Kaixo ${req.session.user}!`, error: ''});
});

router.get('/ordaindu', function(req, res, next) {
    html.login_logout = "<a href='/logout'>Log Out</a>";
    res.render('Ordainketa');
});

module.exports = router;
