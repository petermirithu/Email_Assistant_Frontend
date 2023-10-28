var express = require('express');
const userService = require('../services/userService');
const cacheService = require('../services/cacheService');
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

router.get('/signOut', userService.isAuthenticated, async function (req, res) {    
    await cacheService.clearCache();    
    res.redirect('/signIn')
})

module.exports = router;