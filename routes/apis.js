
var userService = require('../services/userService');
var express = require('express');
var validator = require("email-validator");
var router = express.Router();

function isAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    }
    else {
        req.session.redirectTo = req.originalUrl;
        req.flash('info', 'Please Sign In if you have an Account'),
        res.redirect('/signIn');
    }
}


router.post('/sign_up_user', async function (req, res) {                  
    const payload ={
        firstName :req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        password : req.body.password,        
    }
    
    let warning=null;

    if(payload.firstName.length<3){
        warning = "First name should have atleast 3 characters!"
    }
    else if(payload.lastName.length<3){
        warning = "Last name should have atleast 3 characters!"
    }
    else if(validator.validate(payload.email) == false){
        warning = "Please provide a valid email address!"
    } 
    else if(payload.email.includes("@gmail.com")==false){
        warning = "We currently support gmail emails only! Please use a gmail account."
    }
    else if(payload.password.length<8){
        warning = "Password must be atleast 8 characters!"
    }

    if (warning!=null) {        
        req.flash('warning', warning)
        res.redirect('/signUp')
    } else {
        await userService.createUserAccount(payload).then(response=>{
            req.flash('success','You are now registered and can Log in for verification purpose.'),
            res.redirect('/signIn')             
        }).catch(error=>{                        
            req.flash('error', "Ooops! Seems there was a problem while trying to create your account."),
            res.redirect('/signUp')
        });                    
    }
});

router.post('/sign_in_user', function (req, res, next) {
    const payload ={        
        email : req.body.email,
        password : req.body.password,        
    }

    if(validator.validate(payload.email) == false){
        warning = "Please provide a valid email address!"
    } 
    else if(payload.email.includes("@gmail.com")==false){
        warning = "We currently support gmail emails only! Please use a gmail account."
    }
    else if(payload.password.length<8){
        warning = "Password must be atleast 8 characters!"
    }
    
    if (warning!=null) {        
        req.flash('warning', warning)
        res.redirect('/signUp')
    } else {       
        passport.authenticate('local', {
            successRedirect: req.session.redirectTo || '/',
            failureRedirect: '/',
            failureFlash: true,
        })(req, res, next);
    }
});

module.exports = router;