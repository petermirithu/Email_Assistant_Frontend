var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('pages/home');    
});

router.get('/signIn', function (req, res, next) {
    res.render('pages/signIn');
});

router.get('/signUp', function (req, res, next) {
    res.render('pages/signUp');
});

module.exports = router;