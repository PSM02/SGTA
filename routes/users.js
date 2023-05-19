var express = require('express');
var router = express.Router();
var html = {}
const mongojs = require('mongojs')
const db = mongojs('mongodb://127.0.0.1:27017/SGTA', ['Foods', 'Txartelak'])

router.get('*', function(req, res, next) {
    if(req.session.user) {
        next();
    } else {
        res.render("login" ,{ error: "Sesioa ireki behar duzu!" });
    }
});

router.get('/', function(req, res, next) {
    html.login_logout = "<a href='/logout'>Log Out</a>";
    db.Foods.find(function(err, foods) {
        if(err) {
            console.log(err);
            res.render('Foods', { html: html, error: err });
        } else {
            html.foods = foods;
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
    res.render('Ordainketa' , { html: html, uname:`Kaixo ${req.session.user}!`, error: ''});
});

router.post('/ordaindu', function(req, res, next) {
    html.login_logout = "<a href='/logout'>Log Out</a>";
    html.prezioa = req.body.prezioa;
    res.render('Ordainketa' , { html: html, uname:`Kaixo ${req.session.user}!`, error: ''});
});

router.post('/ordainketa', function(req, res, next) {
    console.log(req.body);
    var num = req.body.number;
    var CVV = parseInt(req.body.CVV);
    var prezioa = req.body.prezioa;
    var data = req.body.expiry_month + "/" + req.body.expiry_year;
    console.log(num);
    console.log(CVV);
    console.log(prezioa);
    console.log(data);
    db.Txartelak.find({Zenb: num, CVV: CVV, Data: data}, function(err, txartela) {
        if(err) {
            console.log(err);
            res.render('Ordainketa', { html: html, error: err });
        } else {
            if(txartela.length == 0) {
                res.render('Ordainketa', { html: html, error: "Txartelaren datuak ez dira zuzenak!" });
            } else {
                if(txartela[0].Dirua < prezioa) {
                    res.render('Ordainketa', { html: html, error: "Ez daukazu nahiko dirurik txartel honetan!" });
                } else {
                    db.Txartelak.update({Zenb: num}, {$inc: {Dirua: -prezioa}}, function(err, txartela) {
                        if(err) {
                            console.log(err);
                            res.render('Ordainketa', { html: html, error: err });
                        } else {
                            res.render('ondoEgina', { html: html, error: '' });
                        }
                    });
                }
            }
        }
    });
});

module.exports = router;
