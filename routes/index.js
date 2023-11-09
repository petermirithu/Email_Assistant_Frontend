var express = require('express');
const userService = require('../services/userService');
const cacheService = require('../services/cacheService');
const emailService = require('../services/emailService');
var router = express.Router();


router.get('/signIn', function (req, res, next) {
    res.render('pages/signIn');
});

router.get('/signUp', function (req, res, next) {
    res.render('pages/signUp');
});

router.get('/', userService.isAuthenticated, async function (req, res, next) {        
    res.render('pages/dashboard');    
});

router.get('/signOut', userService.isAuthenticated, async function (req, res) {    
    await cacheService.clearCache();    
    // await emailService.stopEmailTracking();
    res.redirect('/signIn')
})

module.exports = router;