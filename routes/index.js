var express = require('express');
const userService = require('../services/userService');
var router = express.Router();


router.get('/signIn', function (req, res, next) {
    res.render('pages/signIn');
});

router.get('/signUp', function (req, res, next) {
    res.render('pages/signUp');
});

router.get('/', userService.isAuthenticated, function (req, res, next) {
    res.render('pages/home');    
});

router.get('/signOut', userService.isAuthenticated, function (req, res) {    
    req.logOut();    
    res.redirect('/')
})

module.exports = router;